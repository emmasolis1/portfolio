//
//  LoginViewController.swift
//  Messenger
//
//  Created by Emmanuel Solis on 4/1/22.
//

import UIKit
import FirebaseAuth
import FBSDKLoginKit
import GoogleSignIn
import JGProgressHUD
import AuthenticationServices

class LoginViewController: UIViewController {
  
  private let spinner = JGProgressHUD(style: .dark)
  
  private let image_view: UIImageView = {
    let image_view = UIImageView()
    image_view.image = UIImage(named: "logo")
    image_view.contentMode = .scaleAspectFit
    return image_view
  }()
  
  
  // This to avoid that when view has too many items they overlap or are not visible.
  private let scroll_view: UIScrollView = {
    let scroll_view = UIScrollView()
    scroll_view.clipsToBounds = true
    return scroll_view
  }()
  
  private let email_field:UITextField = {
    let field = UITextField()
    field.autocapitalizationType = .none
    field.autocorrectionType = .no
    field.returnKeyType = .continue
    field.layer.cornerRadius = 12
    field.layer.borderWidth = 1
    field.layer.borderColor = UIColor.lightGray.cgColor
    field.placeholder = "Email Address..."
    // To fix issue where inputed text is very next to the textfield border.
    field.leftView = UIView(frame: CGRect(x: 0, y: 0, width: 10, height: 0))
    field.leftViewMode = .always
    field.backgroundColor = .white
    return field
  }()
  
  private let password_field:UITextField = {
    let field = UITextField()
    field.autocapitalizationType = .none
    field.autocorrectionType = .no
    field.returnKeyType = .done /*Because this is the last step to sign in*/
    field.layer.cornerRadius = 12
    field.layer.borderWidth = 1
    field.layer.borderColor = UIColor.lightGray.cgColor
    field.placeholder = "Password..."
    // To fix issue where inputed text is very next to the textfield border.
    field.leftView = UIView(frame: CGRect(x: 0, y: 0, width: 10, height: 0))
    field.leftViewMode = .always
    field.backgroundColor = .white
    field.isSecureTextEntry = true
    return field
  }()
  
  private let login_button: UIButton = {
    let button = UIButton()
    button.setTitle("Sign In", for: .normal)
    button.backgroundColor = .link
    button.setTitleColor(.white, for: .normal)
    button.layer.cornerRadius = 12
    button.layer.masksToBounds = true
    button.titleLabel?.font = .systemFont(ofSize: 20, weight: .bold)
    return button
  }()
  
  private let facebook_loggin_button: FBLoginButton = {
    let button = FBLoginButton()
    button.permissions = ["public_profile", "email"]
    button.layer.cornerRadius = 12
    button.titleLabel?.font = .systemFont(ofSize: 20)
    return button
  }()
  
  private let google_login_button: GIDSignInButton = {
    let button = GIDSignInButton()
    button.layer.cornerRadius = 12
    return button
  }()
  
  private let apple_login_button: ASAuthorizationAppleIDButton = {
    let button = ASAuthorizationAppleIDButton()
    //button.addTarget(LoginViewController.self, action: #selector(handleAuthorizationAppleIDButtonPress), for: .touchUpInside)
    return button
  }()
  
  private var login_observer: NSObjectProtocol?
  
  override func viewDidLoad() {
    super.viewDidLoad()
    // To notice the result from the AppDelegate
    login_observer = NotificationCenter.default.addObserver(forName: Notification.Name.didLogInNotificacion, object: nil, queue: .main, using: {[weak self] _ in
      guard let strong_self = self else {
        return
      }
      strong_self.navigationController?.dismiss(animated: true, completion: nil)
    })
    GIDSignIn.sharedInstance().presentingViewController = self
    
    title = "Log In"
    view.backgroundColor = .white
    
    navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Register", style: .done, target: self, action: #selector(didTapRegister))
    
    // Add button action.
    login_button.addTarget(self, action: #selector(loginButtonTapped), for: .touchUpInside)
    
    email_field.delegate = self
    password_field.delegate = self
    
    facebook_loggin_button.delegate = self
    
    // Add subviews.
    view.addSubview(scroll_view)
    scroll_view.addSubview(image_view)
    scroll_view.addSubview(email_field)
    scroll_view.addSubview(password_field)
    scroll_view.addSubview(login_button)
    // Facebook Sign In Button.
    scroll_view.addSubview(facebook_loggin_button)
    // Apple Sign In Button
    scroll_view.addSubview(apple_login_button)
    //Google Sign In Button
    scroll_view.addSubview(google_login_button)
  }
  
  // To dismiss the use login_observer after is needed.
  deinit {
    if let observer = login_observer {
      NotificationCenter.default.removeObserver(observer)
    }
  }
  
  override func viewDidLayoutSubviews() {
    super.viewDidLayoutSubviews()
    scroll_view.frame = view.bounds
    // This view .ect is possible because of 'Resources/Extensions'.
    let size = scroll_view.width/3
    image_view.frame = CGRect(x: (scroll_view.width-size)/2, y: 20, width: size, height: size)
    email_field.frame = CGRect(x: 30, y: image_view.bottom+10, width: scroll_view.width-60, height: 52)
    password_field.frame = CGRect(x: 30, y: email_field.bottom+10, width: scroll_view.width-60, height: 52)
    login_button.frame = CGRect(x: 30, y: password_field.bottom+15, width: scroll_view.width-60, height: 52)
    facebook_loggin_button.frame = CGRect(x: 30, y: login_button.bottom+15, width: scroll_view.width-60, height: 52)
    apple_login_button.frame = CGRect(x: 30, y: facebook_loggin_button.bottom+15, width: scroll_view.width-60, height: 52)
    google_login_button.frame = CGRect(x: 30, y: apple_login_button.bottom+15, width: scroll_view.width-60, height: 52)
  }
  
  // Validate if text entered in email and password are valid.
  @objc private func loginButtonTapped() {
    // Dismiss keyboard field if it is register
    email_field.resignFirstResponder()
    password_field.resignFirstResponder()
    
    guard let email = email_field.text, let password = password_field.text,
          !email.isEmpty, !password.isEmpty, password.count >= 6 else {
      aleterUserLogingError()
      return
    }
    
    spinner.show(in: view)
    
    // Firebase Log In.
    FirebaseAuth.Auth.auth().signIn(withEmail: email, password: password, completion: { [weak self] auth_result, error in
      guard let strong_self = self else {
        return
      }
      
      // This sends it from a background thread to the main one.
      DispatchQueue.main.async {
        strong_self.spinner.dismiss()
      }
      
      guard let result = auth_result, error == nil else {
        print("Failed to log in with email \(email)")
        return
      }
      let user = result.user
      print("Logged In with User: \(user)")
      strong_self.navigationController?.dismiss(animated: true, completion: nil)
    })
    
  }
  
  func aleterUserLogingError() {
    let alert = UIAlertController(title: "Error", message: "Please enter all information to login", preferredStyle: .alert)
    alert.addAction(UIAlertAction(title: "Dismiss", style: .cancel, handler: nil))
    present(alert, animated: true)
  }
  
  @objc private func didTapRegister() {
    let view_controller = RegisterViewController()
    view_controller.title = "Create account"
    navigationController?.pushViewController(view_controller, animated: true)
  }
  
}

extension LoginViewController: UITextFieldDelegate {
  func textFieldShouldReturn(_ textField: UITextField) -> Bool {
    if textField == email_field {
      password_field.becomeFirstResponder()
    } else if textField == password_field {
      loginButtonTapped()
    }
    return true
  }
}


extension LoginViewController: LoginButtonDelegate {
  func loginButtonDidLogOut(_ loginButton: FBLoginButton) {
    // Empty func
  }
  
  func loginButton(_ loginButton: FBLoginButton, didCompleteWith result: LoginManagerLoginResult?, error: Error?) {
    guard let token = result?.token?.tokenString else {
      print("User failed to login with Facebook")
      return
    }
    
    let facebook_request = FBSDKLoginKit.GraphRequest(graphPath: "me", parameters: ["fields": "email, name"], tokenString: token, version: nil, httpMethod: .get)
    facebook_request.start(completion: { _, result, error in
      guard let result = result as? [String: Any], error == nil else {
        print("Failed to make graph request.")
        return
      }
      // Grab data from user
      guard let name = result["name"] as? String,
            let email = result["email"] as? String else {
        print("Failed to get data from Facebook token")
        return
      }
      let name_components = name.components(separatedBy: " ")
      guard name_components.count  <= 4 || name_components.count >= 1 else { // Most common form of names.
        return
      }
      let first_name = name_components[0]
      let last_name = name_components[1]
      
      DatabaseManager.shared.user_exist(with: email, completion: {exists in
        if !exists {
          DatabaseManager.shared.insert_user(with: ChatAppUser(first_name: first_name, last_name: last_name, email_address: email))
        }
      })
      
      let credential = FacebookAuthProvider.credential(withAccessToken: token)
      FirebaseAuth.Auth.auth().signIn(with: credential, completion: {[weak self] auth_result, error in
        guard let strong_self = self else {
          return
        }
        guard auth_result != nil, error == nil else {
          if let error = error {
            print("Facebook credetials faield, MFA may be needed - \(error)")
          }
          return
        }
        print("Loggin with Facebook succesfully")
        strong_self.navigationController?.dismiss(animated: true, completion: nil)
      })
    })
  }
}

// Handling Apple Sign In -- Incomplete as this requires me to have an Apple Developer paid account which I do not have.
extension LoginViewController: ASAuthorizationControllerDelegate, ASAuthorizationControllerPresentationContextProviding {
  @objc
  func handleAuthorizationAppleIDButtonPress() {
      let appleIDProvider = ASAuthorizationAppleIDProvider()
      let request = appleIDProvider.createRequest()
      request.requestedScopes = [.fullName, .email]
      
      let authorizationController = ASAuthorizationController(authorizationRequests: [request])
      authorizationController.delegate = self
      authorizationController.presentationContextProvider = self
      authorizationController.performRequests()
  }
  
  func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
      return self.view.window!
  }
}

