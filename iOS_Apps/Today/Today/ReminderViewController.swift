//
//  ViewController.swift
//  Today
//
//  Created by Emmanuel Solis on 2/15/22.
//

import UIKit

class ReminderViewController: UITableViewController {
}

extension ReminderViewController {
  static let reminder_list_cell_identifier = "ReminderListCell"
  
  override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return Reminder.testData.count
  }
  
  // This is want will be send to the table to show to the user.
  override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    // Creates one cell of all.
    guard let cell = tableView.dequeueReusableCell(withIdentifier: Self.reminder_list_cell_identifier, for: indexPath) as? ReminderListCell else {
      fatalError("Unable to dequeue ReminderCell")
    }
    // One cell information.
    let reminder = Reminder.testData[indexPath.row]
    let image = reminder.is_complete ? UIImage(systemName: "circle.fill") : UIImage(systemName: "circle")
    cell.title_label.text = reminder.title
    cell.date_label.text = reminder.due_date.description
    cell.done_button.setBackgroundImage(image, for: .normal)
    cell.doneButtonAction = {
      Reminder.testData[indexPath.row].is_complete.toggle()  // Toggles mean "cambiar/alternar"
      tableView.reloadRows(at: [indexPath], with: .none)
    }
    return cell
  }
  
}
