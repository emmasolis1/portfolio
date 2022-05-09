//
//  NewConversaitonViewController.swift
//  Messenger
//
//  Created by Emmanuel Solis on 4/1/22.
//

import UIKit
import JGProgressHUD

class NewConversationViewController: UIViewController {
    private let spinner = JGProgressHUD()

    private let search_bar: UISearchBar = {
        let search_bar = UISearchBar()
        search_bar.placeholder = "Search for Users..."
        return search_bar
    }()
    
    private let table_view: UITableView = {
        let table = UITableView()
        table.isHidden = true
        table.register(UITableViewCell.self, forCellReuseIdentifier: "cell")
        return table
    }()
    
    private let no_results_label: UILabel = {
       let label = UILabel()
        label.isHidden = true
        label.text = "No User Results..."
        label.textAlignment = .center
        label.textColor = .gray
        label.font = .systemFont(ofSize: 21, weight: .medium)
        return label
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        
        // Frames it automatically.
        navigationController?.navigationBar.topItem?.titleView = search_bar
        navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Cancel", style: .done, target: self, action: #selector(dismissSelf))
        
        // Will invoke the keyboard to pop up automatically at the search bar.
        search_bar.becomeFirstResponder()
    }

    @objc private func dismissSelf() {
        dismiss(animated: true, completion: nil)
    }
}

extension NewConversationViewController: UISearchBarDelegate {
    func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
        
    }
}
