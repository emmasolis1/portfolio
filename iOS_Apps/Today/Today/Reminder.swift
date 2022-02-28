//
//  Reminder.swift
//  Today
//
//  Created by Emmanuel Solis on 2/15/22.
//

import Foundation

struct Reminder {
  var title: String
  var due_date: Date
  var notes: String? = nil
  var is_complete: Bool = false
}

// Initial Test Data.
extension Reminder {
  static var testData = [
    Reminder(title: "Submit reimbursement report", due_date: Date().addingTimeInterval(800.0), notes: "Don't forget about taxi receipts"),
    Reminder(title: "Code review", due_date: Date().addingTimeInterval(14000.0), notes: "Check tech specs in shared folder", is_complete: true),
    Reminder(title: "Pick up new contacts", due_date: Date().addingTimeInterval(24000.0), notes: "Optometrist closes at 6:00PM"),
    Reminder(title: "Add notes to retrospective", due_date: Date().addingTimeInterval(3200.0), notes: "Collaborate with project manager", is_complete: true),
    Reminder(title: "Interview new project manager candidate", due_date: Date().addingTimeInterval(60000.0), notes: "Review portfolio"),
    Reminder(title: "Mock up onboarding experience", due_date: Date().addingTimeInterval(72000.0), notes: "Think different"),
    Reminder(title: "Review usage analytics", due_date: Date().addingTimeInterval(83000.0), notes: "Discuss trends with management"),
    Reminder(title: "Confirm group reservation", due_date: Date().addingTimeInterval(92500.0), notes: "Ask about space heaters"),
    Reminder(title: "Add beta testers to TestFlight", due_date: Date().addingTimeInterval(101000.0),  notes: "v0.9 out on Friday")
  ]
}
