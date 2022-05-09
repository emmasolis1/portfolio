//
//  ViewController.swift
//  Messenger
//
//  Created by Emmanuel Solis on 4/1/22.
//

import UIKit
import FirebaseAuth
import SwiftUI
import JGProgressHUD

class ConversationViewController: UIViewController {
  
  // Spinner to show when something is loading.
  private let spinner = JGProgressHUD(style: .dark)
  
  private let table_view: UITableView = {
    let table = UITableView()
    table.isHidden = true
    table.register(UITableViewCell.self, forCellReuseIdentifier: "cell")
    return table
  }()
  
  private let no_conversation_label: UILabel = {
    let label = UILabel()
    label.text = "No conversations!"
    label.textAlignment = .center
    label.textColor = .gray
    label.font = .systemFont(ofSize: 21, weight: .medium)
    label.isHidden = true
    return label
  }()
  
  override func viewDidLoad() {
    super.viewDidLoad()
    navigationItem.rightBarButtonItem = UIBarButtonItem(barButtonSystemItem: .compose, target: self, action: #selector(didTapComposeButton))
    view.addSubview(table_view)
    view.addSubview(no_conversation_label)
    setup_tableView()
    fetch_conversations()
  }
  
  @objc private func didTapComposeButton() {
    let view_controller = NewConversationViewController()
    let nav_viewController = UINavigationController(rootViewController: view_controller)
    present(nav_viewController, animated: true)
  }
  
  override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    validateAuth()
  }
  
  override func viewDidLayoutSubviews() {
    super.viewDidLayoutSubviews()
    table_view.frame = view.bounds
  }
    
  private func validateAuth() {
    if FirebaseAuth.Auth.auth().currentUser/*This will be saved automatically*/ == nil {
      let view_controller = LoginViewController()
      let navigation_controller = UINavigationController(rootViewController: view_controller)
      navigation_controller.modalPresentationStyle = .fullScreen
      present(navigation_controller, animated: false /*an animation to appear or not*/)
    }
  }

  private func setup_tableView() {
    table_view.delegate = self
    table_view.dataSource = self
  }
  
  private func fetch_conversations() {
    // Fetch from Firebase
    table_view.isHidden = false
  }
}

extension ConversationViewController: UITableViewDelegate, UITableViewDataSource {
  func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return 1
  }
  
  func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let cell = table_view.dequeueReusableCell(withIdentifier: "cell", for: indexPath)
    cell.textLabel?.text = "Hello World"
    cell.accessoryType = .disclosureIndicator
    return cell
  }
  
  func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
    tableView.deselectRow(at: indexPath, animated: true)
    let view_controller = ChatViewController()
    view_controller.title = "Xinia Solis"
    view_controller.navigationItem.largeTitleDisplayMode = .never
    navigationController?.pushViewController(view_controller, animated: true)
  }
}
