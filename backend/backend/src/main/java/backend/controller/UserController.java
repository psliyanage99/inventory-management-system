package backend.controller;

import backend.exception.InventoryNotFoundException;
import backend.exception.UserNotFoundException;
//import backend.model.InventoryModel;
import backend.model.InventoryModel;
import backend.model.UserModel;
import backend.repository.InventoryRepository;
import backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController // To identify this is a controller file
@CrossOrigin("http://localhost:3000") // Define the frontend running port
public class UserController {
    // Imported the repository
    @Autowired
    private UserRepository userRepository;

    // Normal data insert part
    @PostMapping("/user")
    public UserModel newUserModel(@RequestBody UserModel newUserModel) {
        return userRepository.save(newUserModel);
    }

    // User Login
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login (@RequestBody UserModel loginDetails) {
        UserModel user = userRepository.findByEmail(loginDetails.getEmail())
                .orElseThrow(() -> new UserNotFoundException("Email not found : " + loginDetails.getEmail()));


        // Check the pw is matches
        if (user.getPassword().equals(loginDetails.getPassword())){
            Map<String,Object> response = new HashMap<>();
            response.put("message","Login Successfull");
            response.put("id", user.getId());// Return user id
            return ResponseEntity.ok(response);
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message","invalid credential"));
        }
    }

    // Display
    @GetMapping("/user")
    List<UserModel> getAllUsers() {return userRepository.findAll();}

    @GetMapping("/user/{id}")
    UserModel getUserId(@PathVariable Long id){
        return userRepository.findById(id)
                .orElseThrow(()->new UserNotFoundException(id));
    }

    // Update profile
    @PutMapping("user/{id}")
    UserModel updateProfile(@RequestBody UserModel newUserModdel,@PathVariable Long id){
        return userRepository.findById(id)
                .map(userModel -> { // Update user repository data
                    userModel.setFullname(newUserModdel.getFullname()); // Call the getters and setters from the model
                    userModel.setEmail(newUserModdel.getEmail());
                    userModel.setPassword(newUserModdel.getPassword());
                    userModel.setPhone(newUserModdel.getPhone());
                    return userRepository.save(userModel);
                }).orElseThrow(()-> new UserNotFoundException(id));
    }


    //User Profile Delete Part
    @DeleteMapping("/user/{id}") // Create the path as set the id
    String deleteUser(@PathVariable Long id){
        //Check item is existing in db
        // Create the check function To check whether the relevant data exists in the database
        UserModel userProfile = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));

        // Delete item from the repo
        userRepository.deleteById(id);
        return "data with id " + id + "and user deleted";
    }

    // Check email
    @GetMapping("/checkEmail")
    public boolean checkEmailExists(@RequestParam String email){
        return userRepository.existsByEmail(email);
    }

}

