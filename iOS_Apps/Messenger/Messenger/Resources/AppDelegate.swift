//
//  AppDelegate.swift
//  Messenger
//
//  Created by Emmanuel Solis on 4/1/22.
//

import UIKit
import Firebase
import GoogleSignIn
import FBSDKCoreKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, GIDSignInDelegate {
  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    // Firebase Sign In
    FirebaseApp.configure()
    
    // Facebook Sign In
    ApplicationDelegate.shared.application(
      application,
      didFinishLaunchingWithOptions: launchOptions
    )
    
    // Google Sign in
    GIDSignIn.sharedInstance()?.clientID = FirebaseApp.app()?.options.clientID
    GIDSignIn.sharedInstance()?.delegate = self
    
    return true
  }
  
  
  func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey : Any] = [:]
  ) -> Bool {
    ApplicationDelegate.shared.application(
      app,
      open: url,
      sourceApplication: options[UIApplication.OpenURLOptionsKey.sourceApplication] as? String,
      annotation: options[UIApplication.OpenURLOptionsKey.annotation]
    )
    return GIDSignIn.sharedInstance().handle(url)
  }
  
  func sign(_ signIn: GIDSignIn!, didSignInFor user: GIDGoogleUser!, withError error: Error!) {
    guard error == nil else {
      if let error = error {
        print("Failed to log in with Google: \(error)")
      }
      return
    }
    guard let user = user else {
      return
    }
    print("Signed in with Google: \(user)")
    guard let email = user.profile.email,
          let first_name = user.profile.givenName,
          let last_name = user.profile.familyName else {
      return
    }
            
    DatabaseManager.shared.user_exist(with: email, completion: {exists in
      if !exists {
        DatabaseManager.shared.insert_user(with: ChatAppUser(first_name: first_name, last_name: last_name, email_address: email))
      }
    })
    
    guard let authentication = user.authentication else {
      print("Missing auth object of Googler User")
      return
    }
    let credential = GoogleAuthProvider.credential(withIDToken: authentication.idToken, accessToken: authentication.accessToken)
    FirebaseAuth.Auth.auth().signIn(with: credential, completion: {auth_result, error in
      guard auth_result != nil, error == nil else {
        print("Failed to log in with Google credentials")
        return
      }
      print("Sucessfully signed in with Google")
      NotificationCenter.default.post(name: Notification.Name.didLogInNotificacion, object: nil)
    })
  }
  
  func sign(_ signIn: GIDSignIn!, didDisconnectWith user: GIDGoogleUser!, withError error: Error!) {
    print("Google user was disconnected")
  }
}

