package backend.controller;

import backend.exception.InventoryNotFoundException;
import backend.model.InventoryModel;
import backend.repository.InventoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RestController // To identify this is a controller file
@CrossOrigin("http://localhost:3000")
public class InventoryController {
    // Imported the repository
    @Autowired
    private InventoryRepository inventoryRepository;

    // Normal data insert part
    @PostMapping("/inventory")
    public InventoryModel newInventoryModel(@RequestBody InventoryModel newInventoryModel) {
        return inventoryRepository.save(newInventoryModel);
    }

    // Image insert part
    @PostMapping("/inventory/itemImg")
    public String itemImage(@RequestParam("file") MultipartFile file) {
        String folder = "backend/src/main/uploads/";
        String itemImage = file.getOriginalFilename();

        try {
            File uploadDir = new File(folder);
            if (!uploadDir.exists()) {
                uploadDir.mkdir();
            }
            file.transferTo(Paths.get(folder + itemImage));
        } catch (IOException e) {
            e.printStackTrace();
            return "Error uploading file; " + itemImage;
        }
        return itemImage;
    }

    //Normal display part
    @GetMapping("/inventory") // Path call
    List<InventoryModel> getAllItems() {  //Call the model
        return inventoryRepository.findAll(); // That(model) return to repository
    }

    // Data display with id
    @GetMapping("/inventory/{id}") // Add Id to path // {id} data of the relevant id is automatically cached.
    InventoryModel getItemID(@PathVariable Long id) { // Given the function name (getItemId)
        return inventoryRepository.findById(id).orElseThrow(() -> new InventoryNotFoundException(id)); // Call the repository
    }

    //Display image part
    private final String UPLOAD_DIR = "backend/src/main/uploads/"; // Firstly image location assign to variable

    @GetMapping("backend/src/main/uploads/{filename}") // Cached file name in the upload directory
    public ResponseEntity<FileSystemResource> getImage(@PathVariable String filename) {
        File file = new File(UPLOAD_DIR + filename);
        if (!file.exists()) {  // Checks whether the file exists or not.
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new FileSystemResource(file));
    }

    // Marks this method to handle HTTP PUT requests at the path /inventory/{id}
    @PutMapping("/inventory/{id}") // Call the API.
    public InventoryModel updateItem (
            // Extracts the "itemDetails" part from the multipart request as a JSON string
            @RequestPart(value = "itemDetails") String itemDetails,

            // Extracts the "file" part (optional) from the multipart request as a file
            @RequestPart(value = "file" ,required = false) MultipartFile file,

            // Gets the {id} value from the URL path
            @PathVariable Long id
    ){
        // Logs the received itemDetails string for debugging
        System.out.println("Item Details: "+ itemDetails);

        // Checks if a file is uploaded and logs its name, or prints a message if no file is uploaded
        if(file != null){
            System.out.println("File received: " +file.getOriginalFilename());
        }else {
            System.out.println("no file uploaded");
        }

        // Create a Jackson ObjectMapper instance to convert JSON to Java object
        ObjectMapper mapper = new ObjectMapper();
        InventoryModel newInventory;
        try{
            // Convert the itemDetails JSON string into an InventoryModel object
            newInventory = mapper.readValue(itemDetails,InventoryModel.class);
        }catch (Exception e){
            // If parsing fails, throw a runtime exception with the error
            throw new RuntimeException("Error parsing iteDetails", e);
        }

        // Look up the inventory item by its ID
        return inventoryRepository.findById(id).map(existingInventory -> {
            // Update the existing inventory fields with values from the newInventory object
            existingInventory.setItemId(newInventory.getItemId());
            existingInventory.setItemName(newInventory.getItemName());
            existingInventory.setItemCategory(newInventory.getItemCategory());
            existingInventory.setItemQty(newInventory.getItemQty());
            existingInventory.setItemDetails(newInventory.getItemDetails());

            // If a file was uploaded and is not empty, handle the file saving process
            if(file != null && !file.isEmpty()){
                // Specify the directory where the uploaded file will be saved
                String folder = "backend/src/main/uploads/";

                // Get the original file name of the uploaded file
                String itemImage = file.getOriginalFilename();
                try{
                    // Save the uploaded file to the specified folder
                    file.transferTo(Paths.get(folder + itemImage));

                    // Set the itemImage property of the inventory object to the uploaded file name
                    existingInventory.setItemImage(itemImage);
                }catch (IOException e){
                    // If saving the file fails, throw a runtime exception with the error
                    throw new RuntimeException("Error saving uploaded file", e);
                }
            }

            // Save the updated inventory object back to the database
            return inventoryRepository.save(existingInventory);
            // If the item with the given ID is not found, throw a custom exception
        }).orElseThrow(()-> new InventoryNotFoundException(id));
    }

    //Delete Part
    @DeleteMapping("/inventory/{id}") // Create the path as set the id
    String deleteItem(@PathVariable Long id){
        //Check item is existing in db
        // Create the check function To check whether the relevant data exists in the database
        InventoryModel inventoryItem = inventoryRepository.findById(id).orElseThrow(() -> new InventoryNotFoundException(id));

        //Img delete part
        String itemImage = inventoryItem.getItemImage();
        if (itemImage != null && !itemImage.isEmpty()) {
            File imageFile = new File("backend/src/main/uploads" + itemImage);
            if (imageFile.exists()){
                if (imageFile.delete()){
                    System.out.println("Image Deleted");
                }else {
                    System.out.println("Failed Image Deleted");
                }
            }
        }
        // Delete item from the repo
        inventoryRepository.deleteById(id);
        return "data with id " + id + "and image deleted";
    }

}