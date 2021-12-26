use anchor_lang::prelude::*;

#[account]
pub struct ProjectHistory {
    head: u64,
    project_records: [ProjectRecord; 1024],
}

impl Default for ProjectHistory {
    fn default() -> Self {
        ProjectHistory {
            head: 0,
            project_records: [ProjectRecord::default(); 1024],
        }
    }
}

impl ProjectHistory {
    pub fn append(&mut self, pos: ProjectRecord) {
        self.project_records[ProjectHistory::index_of(self.head)] = pos;
        self.head = (self.head + 1) % 1024;
    }

    pub fn index_of(counter: u64) -> usize {
        std::convert::TryInto::try_into(counter).unwrap()
    }

    pub fn next_record_id(&self) -> u128 {
        let prev_record_id = if self.head == 0 {1023} else {self.head - 1};
        let prev_record = &self.project_records[ProjectHistory::index_of(prev_record_id)];
        prev_record.record_id + 1
    }
}

#[derive(Default, AnchorSerialize, AnchorDeserialize, Copy, Clone)]
pub struct ProjectRecord {
    pub record_id: u128,
    pub representative: Pubkey,
    pub current_amount: u64,
    pub goal_amount: u64,
    pub deadline: i64,
    pub achieved: bool,
}
