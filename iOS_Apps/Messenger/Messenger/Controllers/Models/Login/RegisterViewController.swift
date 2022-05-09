//
//  RegisterViewController.swift
//  Messenger
//
//  Created by Emmanuel Solis on 4/1/22.
//

import UIKit
import FirebaseAuth
import JGProgressHUD

class RegisterViewController: UIViewController {
  
  private let spinner = JGProgressHUD(style: .dark)
  
  // This to avoid that when view has too many items they overlap or are not visible.
  private let scroll_view: UIScrollView = {
    let scroll_view = UIScrollView()
    scroll_view.clipsToBounds = true
    return scroll_view
  }()
  
  private let image_view: UIImageView = {
    let image_view = UIImageView()
    //image_view.image = UIImage(named: "logo")
    image_view.image = UIImage(systemName: "person.circle")
    image_view.tintColor = .link
    image_view.contentMode = .scaleAspectFit
    image_view.layer.masksToBounds = true
    image_view.layer.borderWidth = 2
    image_view.layer.borderColor = UIColor.lightGray.cgColor
    return image_view
  }()
  
  private let first_name_field: UITextField = {
    let field = UITextField()
    field.autocapitalizationType = .none
    field.autocorrectionType = .no
    field.returnKeyType = .continue
    field.layer.cornerRadius = 12
    field.layer.borderWidth = 1
    field.layer.borderColor = UIColor.lightGray.cgColor
    field.placeholder = "First Name..."
    // To fix issue where inputed text is very next to the textfield border.
    field.leftView = UIView(frame: CGRect(x: 0, y: 0, width: 10, height: 0))
    field.leftViewMode = .always
    field.backgroundColor = .white
    return field
  }()
  
  private let last_name_field:UITextField = {
    let field = UITextField()
    field.autocapitalizationType = .none
    field.autocorrectionType = .no
    field.returnKeyType = .continue
    field.layer.cornerRadius = 12
    field.layer.borderWidth = 1
    field.layer.borderColor = UIColor.lightGray.cgColor
    field.placeholder = "Last Name..."
    // To fix issue where inputed text is very next to the textfield border.
    field.leftView = UIView(frame: CGRect(x: 0, y: 0, width: 10, height: 0))
    field.leftViewMode = .always
    field.backgroundColor = .white
    return field
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
  
  private let register_button: UIButton = {
    let button = UIButton()
    button.setTitle("Register", for: .normal)
    button.backgroundColor = .systemGreen
    button.setTitleColor(.white, for: .normal)
    button.layer.cornerRadius = 12
    button.layer.masksToBounds = true
    button.titleLabel?.font = .systemFont(ofSize: 20, weight: .bold)
    return button
  }()
  
  override func viewDidLoad() {
    super.viewDidLoad()
    title = "Register"
    view.backgroundColor = .white
    
    navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Register", style: .done, target: self, action: #selector(didTapRegister))
    
    // Add button action.
    register_button.addTarget(self, action: #selector(registerButtonTapped), for: .touchUpInside)
    email_field.delegate = self
    password_field.delegate = self
    
    // Add subviews.
    view.addSubview(scroll_view)
    scroll_view.addSubview(image_view)
    scroll_view.addSubview(first_name_field)
    scroll_view.addSubview(last_name_field)
    scroll_view.addSubview(email_field)
    scroll_view.addSubview(password_field)
    scroll_view.addSubview(register_button)
    // To change profile picture.
    scroll_view.isUserInteractionEnabled = true
    image_view.isUserInteractionEnabled = true
    let gesture = UITapGestureRecognizer(target: self, action: #selector(didTapChangeProfilePicture))
    image_view.addGestureRecognizer(gesture)
  }
  
  @objc private func didTapChangeProfilePicture() {
    presentPhotoActionSheet()
  }
  
  override func viewDidLayoutSubviews() {
    super.viewDidLayoutSubviews()
    scroll_view.frame = view.bounds
    // This view .ect is possible because of 'Resources/Extensions'.
    let size = scroll_view.width/3
    image_view.frame = CGRect(x: (scroll_view.width-size)/2, y: 20, width: size, height: size)
    image_view.layer.cornerRadius = image_view.width/2.0
    first_name_field.frame = CGRect(x: 30, y: image_view.bottom+10, width: scroll_view.width-60, height: 52)
    last_name_field.frame = CGRect(x: 30, y: first_name_field.bottom+10, width: scroll_view.width-60, height: 52)
    email_field.frame = CGRect(x: 30, y: last_name_field.bottom+10, width: scroll_view.width-60, height: 52)
    password_field.frame = CGRect(x: 30, y: email_field.bottom+10, width: scroll_view.width-60, height: 52)
    register_button.frame = CGRect(x: 30, y: password_field.bottom+15, width: scroll_view.width-60, height: 52)
  }
  
  // Validate if text entered in email and password are valid.
  @objc private func registerButtonTapped() {
    // Dismiss keyboard field if it is register
    first_name_field.resignFirstResponder()
    last_name_field.resignFirstResponder()
    email_field.resignFirstResponder()
    password_field.resignFirstResponder()
    
    guard let first_name = first_name_field.text,
          let last_name = last_name_field.text,
          let email = email_field.text,
          let password = password_field.text,
          !first_name.isEmpty, !last_name.isEmpty, !email.isEmpty, !password.isEmpty, password.count >= 6 else {
      aleterUserLogingError()
      return
    }
    spinner.show(in: view)
    
    // Firebase Registration.
    DatabaseManager.shared.user_exist(with: email, completion: {[weak self] exist in
      guard let strong_self = self else {
        return
      }
      
      // This sends it from a background thread to the main one.
      DispatchQueue.main.async {
        strong_self.spinner.dismiss()
      }
      
      guard !exist else {
        // User already exist
        strong_self.aleterUserLogingError(my_message: "Looks like a user account for the email \(email) already exist.")
        return
      }
      FirebaseAuth.Auth.auth().createUser(withEmail: email, password: password, completion: {auth_result, error in
        guard auth_result != nil, error == nil else {
          print("Error creating user")
          return
        }
        DatabaseManager.shared.insert_user(with: ChatAppUser(first_name: first_name, last_name: last_name, email_address: email))
        strong_self.navigationController?.dismiss(animated: true, completion: nil)
      })
    })
  }
  
  func aleterUserLogingError(my_message: String = "Please enter all information to create an account") {
    let alert = UIAlertController(title: "Error", message: my_message, preferredStyle: .alert)
    alert.addAction(UIAlertAction(title: "Dismiss", style: .cancel, handler: nil))
    present(alert, animated: true)
  }
  
  @objc private func didTapRegister() {
    let view_controller = RegisterViewController()
    view_controller.title = "Create account"
    navigationController?.pushViewController(view_controller, animated: true)
  }
  
}

extension RegisterViewController: UITextFieldDelegate {
  func textFieldShouldReturn(_ textField: UITextField) -> Bool {
    if textField == email_field {
      password_field.becomeFirstResponder()
    } else if textField == password_field {
      registerButtonTapped()
    }
    return true
  }
}

extension RegisterViewController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
  // Show user options to choose action.
  func presentPhotoActionSheet() {
    let action_sheet = UIAlertController(title: "Profile picture", message: "How would you like to select a picture", preferredStyle: .actionSheet)
    action_sheet.addAction(UIAlertAction(title: "Take Photo", style: .default, handler: { [weak self] _ in
      self?.presentCamera()
    }))
    action_sheet.addAction(UIAlertAction(title: "Choose Photo", style: .default, handler: { [weak self]_ in
      self?.presentPhotoPicker()
    }))
    action_sheet.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))
    
    
    present(action_sheet, animated: true)
  }
  
  func presentCamera() {
    let view_controller = UIImagePickerController()
    view_controller.sourceType = .camera
    view_controller.delegate = self
    // Allow user to select a section of the photo
    view_controller.allowsEditing = true
    present(view_controller, animated: true)
  }
  
  func presentPhotoPicker() {
    let view_controller = UIImagePickerController()
    view_controller.sourceType = .photoLibrary
    view_controller.delegate = self
    // Allow user to select a section of the photo
    view_controller.allowsEditing = true
    present(view_controller, animated: true)
  }
  
  // Case user selected the photo.
  func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
    picker.dismiss(animated: true, completion: nil)
    print(info)
    // Update image to be selected image
    guard let selected_image = info[UIImagePickerController.InfoKey.editedImage] as? UIImage else {
      return
    }
    self.image_view.image = selected_image
  }
  
  // Case user cancel the selection.
  func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
    picker.dismiss(animated: true, completion: nil)
  }
}
