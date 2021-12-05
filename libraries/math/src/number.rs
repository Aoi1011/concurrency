use std::{
    iter::Sum,
    ops::{Add, AddAssign, Div, DivAssign, Mul, MulAssign, Sub, SubAssign},
};

use bytemuck::{Pod, Zeroable};
use std::fmt::{Display, Formatter};
use thiserror::Error;
use uint::construct_uint;

construct_uint! {
    #[derive(Pod, Zeroable)]
    pub struct U192(3);
}

pub const BPS_EXPONENT: i32 = -4;
const PRECISION: i32 = 15;
const ONE: U192 = U192([1_000_000_000_000_000, 0, 0]);
const U64_MAX: U192 = U192([0xffffffffffffffff, 0x0, 0x0]);

#[derive(Pod, Zeroable, Default, Debug, Clone, Copy, Eq, PartialEq, Ord, PartialOrd)]
#[repr(transparent)]
pub struct Number(U192);

static_assertions::const_assert_eq!(24, std::mem::size_of::<Number>());
static_assertions::const_assert_eq!(0, std::mem::size_of::<Number>() % 8);
impl Number {
    pub const ONE: Number = Number(ONE);
    pub const ZERO: Number = Number(U192::zero());

    pub fn as_u64(&self, exponent: impl Into<i32>) -> u64 {
        let extra_precision = PRECISION + exponent.into();
        let mut prec_value = Self::ten_pow(extra_precision.abs() as u32);

        if extra_precision < 0 {
            prec_value = ONE / prec_value;
        }

        let target_value = self.0 / prec_value;
        if target_value > U64_MAX {
            panic!("cannot convert to u64 due to overflow");
        }

        target_value.as_u64()
    }

    pub fn as_u64_ceil(&self, exponent: impl Into<i32>) -> u64 {
        let extra_precision = PRECISION + exponent.into();
        let mut prec_value = Self::ten_pow(extra_precision.abs() as u32);

        if extra_precision < 0 {
            prec_value = ONE / prec_value;
        }

        let target_value = (prec_value - U192::from(1) + self.0) / prec_value;

        if target_value > U64_MAX {
            panic!("cannot convert to u64 due to overflow");
        }

        target_value.as_u64()
    }

    pub fn as_u64_rounded(&self, exponent: impl Into<i32>) -> u64 {
        let extra_precision = PRECISION + exponent.into();
        let mut prec_value = Self::ten_pow(extra_precision.abs() as u32);

        if extra_precision < 0 {
            prec_value = ONE / prec_value;
        }

        let rounding = match extra_precision > 0 {
            true => U192::from(1) * prec_value / 2,
            false => U192::zero(),
        };

        let target_value = (rounding + self.0) / prec_value;
        if target_value > U64_MAX {
            panic!("cannot convert to u64 due to overflow");
        }

        target_value.as_u64()
    }

    pub fn from_decimal(value: impl Into<U192>, exponent: impl Into<i32>) -> Self {
        let extra_precision = PRECISION + exponent.into();
        let mut prec_value = Self::ten_pow(extra_precision.abs() as u32);

        if extra_precision < 0 {
            prec_value = ONE / prec_value;
        }

        Self(value.into() * prec_value)
    }

    pub fn from_bps(basis_points: u16) -> Number {
        Number::from_decimal(basis_points, BPS_EXPONENT)
    }

    pub fn pow(&self, exp: impl Into<Number>) -> Number {
        let value = self.0.pow(exp.into().0);

        Self(value)
    }

    pub fn saturating_add(&self, n: Number) -> Number {
        Number(self.0.saturating_add(n.0))
    }

    pub fn saturating_sub(&self, n: Number) -> Number {
        Number(self.0.saturating_sub(n.0))
    }

    pub fn saturating_mul(&self, n: Number) -> Number {
        Number(self.0.saturating_mul(n.0))
    }

    pub fn ten_pow(exponent: u32) -> U192 {
        let value: u64 = match exponent {
            16 => 10_000_000_000_000_000,
            15 => 1_000_000_000_000_000,
            14 => 100_000_000_000_000,
            13 => 10_000_000_000_000,
            12 => 1_000_000_000_000,
            11 => 100_000_000_000,
            10 => 10_000_000_000,
            9 => 1_000_000_000,
            8 => 100_000_000,
            7 => 10_000_000,
            6 => 1_000_000,
            5 => 100_000,
            4 => 10_000,
            3 => 1_000,
            2 => 100,
            1 => 10,
            0 => 1,
            _ => panic!("no support for exponent: {}", exponent),
        };

        value.into()
    }
}

impl<T: Into<U192>> From<T> for Number {
    fn from(n: T) -> Number {
        Number(n.into() * ONE)
    }
}

impl From<Number> for [u8; 24] {
    fn from(n: Number) -> Self {
        n.0.into()
    }
}

impl Display for Number {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        let rem = self.0 % ONE;
        let decimal_digits = PRECISION as usize;
        let rem_str = rem.to_string();

        let decimals = "0".repeat(decimal_digits - rem_str.len()) + &*rem_str;
        let striped_decimals = decimals.trim_end_matches('0');
        let pretty_decimals = if striped_decimals.is_empty() {
            "0"
        } else {
            striped_decimals
        };

        if self.0 < ONE {
            write!(f, "0.{}", pretty_decimals)?;
        } else {
            let int = self.0 / ONE;
            write!(f, "{}.{}", int, pretty_decimals)?;
        }

        Ok(())
    }
}

#[derive(Error, Debug, Clone, Eq, PartialEq)]
pub enum Error {
    #[error("An integer value overflowed")]
    Overflow(Number),

    #[error("Attempting to divide by zero")]
    DivideByZero,
}

impl Add<Number> for Number {
    type Output = Number;

    fn add(self, rhs: Number) -> Self::Output {
        Self(self.0.add(rhs.0))
    }
}

impl AddAssign<Number> for Number {
    fn add_assign(&mut self, rhs: Number) {
        self.0.add_assign(rhs.0)
    }
}

impl SubAssign<Number> for Number {
    fn sub_assign(&mut self, rhs: Number) {
        self.0.sub_assign(rhs.0)
    }
}

impl Sub<Number> for Number {
    type Output = Number;

    fn sub(self, rhs: Number) -> Self::Output {
        Self(self.0.sub(rhs.0))
    }
}

impl Mul<Number> for Number {
    type Output = Number;

    fn mul(self, rhs: Number) -> Self::Output {
        Self(self.0.mul(rhs.0).div(ONE))
    }
}

impl MulAssign<Number> for Number {
    fn mul_assign(&mut self, rhs: Number) {
        self.0.mul_assign(rhs.0);
        self.0.div_assign(ONE)
    }
}

impl Div<Number> for Number {
    type Output = Number;

    fn div(self, rhs: Number) -> Self::Output {
        Self(self.0.mul(ONE).div(rhs.0))
    }
}

impl<T: Into<U192>> Mul<T> for Number {
    type Output = Number;

    fn mul(self, rhs: T) -> Self::Output {
        Self(self.0.mul(rhs.into()))
    }
}

impl<T: Into<U192>> Div<T> for Number {
    type Output = Number;

    fn div(self, rhs: T) -> Self::Output {
        Self(self.0.div(rhs.into()))
    }
}

impl Sum for Number {
    fn sum<I: Iterator<Item = Self>>(iter: I) -> Self {
        iter.reduce(|a, b| a + b).unwrap_or(Self::ZERO)
    }
}
