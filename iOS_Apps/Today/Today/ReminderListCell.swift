//
//  ReminderListCell.swift
//  Today
//
//  Created by Emmanuel Solis on 2/15/22.
//

import UIKit

class ReminderListCell : UITableViewCell {
  typealias DoneButtonAction = () -> Void
  
  @IBOutlet var title_label: UILabel!
  @IBOutlet var date_label: UILabel!
  @IBOutlet var done_button: UIButton!
  
  var doneButtonAction: DoneButtonAction?
  
  @IBAction func doneButtonTriggered(_ sender: UIButton) {
    doneButtonAction?()
  }

  
}
