//
//  DatabaseManager.swift
//  Messenger
//
//  Created by Emmanuel on 4/27/22.
//

import Foundation
import FirebaseDatabase

final/*Means this can not be subclass*/ class DatabaseManager {
  static let shared = DatabaseManager()
  
  private let database = Database.database().reference()
}

// MARK: - Account Management
extension DatabaseManager {
  public func user_exist(with email: String, completion: @escaping((Bool) -> Void) /*return true if exits*/) {
    
    var safe_email = email.replacingOccurrences(of: ".", with: "-")
    safe_email = safe_email.replacingOccurrences(of: "@", with: "-")
    
    database.child(safe_email).observeSingleEvent(of: .value, with: { snapshot in
      guard snapshot.value as? String != nil else {
        completion(false)
        return
      }
      completion(true)
    })
  }
  
  /// Insert new user to database.
  public func insert_user(with user: ChatAppUser) {
    database.child(user.safe_email /*Can't be two user with same email address*/).setValue([
      "first_name": user.first_name,
      "last_name": user.last_name
    ])
  }
}

struct ChatAppUser {
  let first_name: String
  let last_name: String
  let email_address: String
  
  var safe_email: String {
    var safe_email = email_address.replacingOccurrences(of: ".", with: "-")
    safe_email = safe_email.replacingOccurrences(of: "@", with: "-")
    return safe_email
  }
  
  // let profile_picture_url: String
}
