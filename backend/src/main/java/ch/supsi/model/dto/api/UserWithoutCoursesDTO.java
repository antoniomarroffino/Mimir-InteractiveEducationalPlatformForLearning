package ch.supsi.model.dto.api;

public class UserWithoutCoursesDTO {
    private String azureOid;
    private String name;
    private String email;

    public UserWithoutCoursesDTO() {
    }

    public UserWithoutCoursesDTO(String azureOid, String name, String email) {
        this.azureOid = azureOid;
        this.name = name;
        this.email = email;
    }

    public String getAzureOid() {
        return azureOid;
    }

    public void setAzureOid(String azureOid) {
        this.azureOid = azureOid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
