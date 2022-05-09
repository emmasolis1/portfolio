//
//  ChatViewController.swift
//  Messenger
//
//  Created by Emmanuel on 5/3/22.
//

import UIKit
import MessageKit

struct Message: MessageType {
    var sender: SenderType
    
    var messageId: String
    
    var sentDate: Date
    
    var kind: MessageKind
}

struct Sender: SenderType {
    var photo_url: String
    var senderId: String
    var displayName: String
}


class ChatViewController: MessagesViewController {
    private var messages = [Message]()
    private let self_sender = Sender(photo_url: "", senderId: "1", displayName: "Emmanuel Solis")

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .red
        
        messages.append(Message(sender: self_sender, messageId: "1", sentDate: Date(), kind: .text("Hello world message. Hello world message. Hello world message. Hello world message. Hello world message. Hello world message.")))
        
        messagesCollectionView.messagesDataSource = self
        messagesCollectionView.messagesLayoutDelegate = self
        messagesCollectionView.messagesDisplayDelegate = self
    }

}

extension ChatViewController: MessagesDataSource, MessagesLayoutDelegate, MessagesDisplayDelegate {
    func currentSender() -> SenderType {
        return self_sender
    }
    
    func messageForItem(at indexPath: IndexPath, in messagesCollectionView: MessagesCollectionView) -> MessageType {
        return messages[indexPath.section]
    }
    
    func numberOfSections(in messagesCollectionView: MessagesCollectionView) -> Int {
        return messages.count
    }
    
}
