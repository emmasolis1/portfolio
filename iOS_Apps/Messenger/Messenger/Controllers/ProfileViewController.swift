//
//  ProfileViewController.swift
//  Messenger
//
//  Created by Emmanuel Solis on 4/1/22.
//

import UIKit
import FirebaseAuth
import FBSDKLoginKit // For handling Facebook Log Out.
import GoogleSignIn

class ProfileViewController: UIViewController {
    @IBOutlet var table_view: UITableView!
    let data = ["Log Out"]

    override func viewDidLoad() {
        super.viewDidLoad()
        table_view.register(UITableViewCell.self, forCellReuseIdentifier: "cell")
        table_view.delegate = self
        table_view.dataSource = self
    }
}

extension ProfileViewController: UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return data.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = table_view.dequeueReusableCell(withIdentifier: "cell", for: indexPath)
        cell.textLabel?.text = data[indexPath.row]
        cell.textLabel?.textAlignment = .center
        cell.textLabel?.textColor = .red
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        table_view.deselectRow(at: indexPath, animated: true)
        let action_sheet = UIAlertController(title: "Log Out Confirmation", message: "", preferredStyle: .actionSheet)
        action_sheet.addAction(UIAlertAction(title: "Log Out", style: .destructive, handler: { [weak self] _ in
            guard let strong_self = self else {return}
            do {
                // Firebase Log Out
                try FirebaseAuth.Auth.auth().signOut()
                let view_controller = LoginViewController()
                let navigation_controller = UINavigationController(rootViewController: view_controller)
                navigation_controller.modalPresentationStyle = .fullScreen
                strong_self.present(navigation_controller, animated: true /*an animation to appear or not*/)
                
                // Facebook Log Out
                FBSDKLoginKit.LoginManager().logOut()
                
                // Google Log Out
                GIDSignIn.sharedInstance()?.signOut()
            } catch {
                
            }
        }))
        action_sheet.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))
        present(action_sheet, animated: true)
    }
}
