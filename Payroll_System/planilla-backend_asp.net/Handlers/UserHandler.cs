using planilla_backend_asp.net.Models;
using System.Data.SqlClient;
using System.Data;
using System.Collections.Generic;
using Newtonsoft.Json;
using System;

namespace planilla_backend_asp.net.Handlers
{
  public class UserHandler
  {
    private static SqlConnection connection;
    private string rutaConexion;
    public UserHandler()
    {
      var builder = WebApplication.CreateBuilder();
      rutaConexion = builder.Configuration.GetConnectionString("EmpleadorContext");
      connection = new SqlConnection(rutaConexion);
    }

    public List<UserModelSummarized> GetAllEmployeesSummarized()
    {
      // Make consult to database
      string consult = "select FirstName, LastName, LastName2, Identification, Email, Country, State, City, Phone from Users where UserType=1 order by FirstName";
      DataTable employeesResult = CreateTableConsult(consult);

      // Convert data to list
      List<UserModelSummarized> employees = new List<UserModelSummarized>();
      foreach (DataRow columna in employeesResult.Rows)
      {
        var rowAddress = "";
        if (Convert.ToString(columna["State"]) != "" && Convert.ToString(columna["Country"]) != "")
        {
          rowAddress = Convert.ToString(columna["State"]) + ", " + Convert.ToString(columna["Country"]);
        }
        else if (Convert.ToString(columna["State"]) == "" && Convert.ToString(columna["Country"]) != "")
        {
          rowAddress = "No registered State" + ", " + Convert.ToString(columna["Country"]);
        }
        else if (Convert.ToString(columna["State"]) != "" && Convert.ToString(columna["Country"]) == "")
        {
          rowAddress = Convert.ToString(columna["State"] + ", " + "No registered Country");
        }
        else if (Convert.ToString(columna["State"]) + ", " + Convert.ToString(columna["Country"]) == ", ")
        {
          rowAddress = "No registered address";
        }
        employees.Add(
          new UserModelSummarized
          {
            FullName = Convert.ToString(columna["FirstName"]) + " " + Convert.ToString(columna["LastName"]) + " " + Convert.ToString(columna["LastName2"]),
            Identification = Convert.ToString(columna["Identification"]),
            Email = Convert.ToString(columna["Email"]),
            Phone = Convert.ToString(columna["Phone"]),
            Address = rowAddress
          });
      }

      return employees;
    }

    private DataTable CreateTableConsult(string consult)
    {
      SqlCommand queryCommand = new SqlCommand(consult, connection);
      SqlDataAdapter adaptadorParaTabla = new
      SqlDataAdapter(queryCommand);
      DataTable tableFormatConsult = new DataTable();
      connection.Open();
      adaptadorParaTabla.Fill(tableFormatConsult);
      connection.Close();
      return tableFormatConsult;
    }

    private DataTable CreateTableConsultContract(SqlDataAdapter tableAdapter)
    {
      DataTable consultTable = new DataTable();
      connection.Open();
      tableAdapter.Fill(consultTable);
      connection.Close();

      return consultTable;
    }

    public List<string> GetUserData(string email, string password)
    {
      var userID = "";
      var userType = "";
      var userFullname = "";
      var consult = @"SELECT Identification, UserType, FirstName, LastName, LastName2
                      FROM Users
                      WHERE Email = @email AND Password = @password";
      var queryCommand = new SqlCommand(consult, connection);

      // Uses user's email to get their ID
      queryCommand.Parameters.AddWithValue("@email", email);
      queryCommand.Parameters.AddWithValue("@password", password);

      connection.Open();
      SqlDataReader reader = queryCommand.ExecuteReader();
      while (reader.Read())
      {
        userID = reader["Identification"].ToString();
        userType = reader["UserType"].ToString();
        userFullname = reader["FirstName"].ToString() + " " + reader["LastName"].ToString() + " " + reader["LastName2"].ToString();
      }
      connection.Close();

      List<string> data = new List<string>();
      data.Add(userID);
      data.Add(userType);
      data.Add(userFullname);
      data.Add(GetUserProjects(userID, userType).ToString());

      return data;
    }

    private string GetUserProjects(string id, string userType)
    {
      string response = "";
      if (userType.Equals("0")) // It's an employer
      {
        List<string> projects = new List<string>();
        var consult = @"select ProjectName from Projects where EmployerID=@id and IsActive=0";
        var queryCommand = new SqlCommand(consult, connection);
        queryCommand.Parameters.AddWithValue("@id", id);
        connection.Open();
        SqlDataReader reader = queryCommand.ExecuteReader();
        while (reader.Read())
        {
          projects.Add(reader["ProjectName"].ToString());
          projects.Add("");
        }
        connection.Close();
        response = JsonConvert.SerializeObject(projects);
      }
      else if (userType.Equals("1")) // It's an employee
      {
        List<string> projects = new List<string>();
        var consult = @"select c.ProjectName, p.EmployerID from Contracts c, Projects p where c.EmployeeID=@id and c.RealEndedDate is not null and p.ProjectName=c.ProjectName and p.IsActive=0";
        var queryCommand = new SqlCommand(consult, connection);
        queryCommand.Parameters.AddWithValue("@id", id);
        connection.Open();
        SqlDataReader reader = queryCommand.ExecuteReader();
        while (reader.Read())
        {
          projects.Add(reader["ProjectName"].ToString());
          projects.Add(reader["EmployerID"].ToString());
        }
        connection.Close();
        response = JsonConvert.SerializeObject(projects);
      }
      return response;
    }

    public List<UserModelSummarized> GetSpecificProjectEmployees(string projectName, string employerID)
    {
      // Make consult to database
      string consult = "EXEC GetEmployeesWorkingOnProject @projectName = @thisProjectName, @employerID = @thisEmployerID";
      var queryCommand = new SqlCommand(consult, connection);

      queryCommand.Parameters.AddWithValue("@thisProjectName", projectName);
      queryCommand.Parameters.AddWithValue("@thisEmployerID", employerID);

      List<UserModelSummarized> employees = new List<UserModelSummarized>();

      connection.Open();
      SqlDataReader reader = queryCommand.ExecuteReader();
      while (reader.Read())
      {
        var rowAddress = "";
        if (reader["State"].ToString() != "" && reader["Country"].ToString() != "")
        {
          rowAddress = reader["State"].ToString() + ", " + reader["Country"].ToString();
        }
        else if (reader["State"].ToString() == "" && reader["Country"].ToString() != "")
        {
          rowAddress = "No registered State" + ", " + reader["Country"].ToString();
        }
        else if (reader["State"].ToString() != "" && reader["Country"].ToString() == "")
        {
          rowAddress = reader["State"].ToString() + ", " + "No registered Country";
        }
        else if (reader["State"].ToString() + ", " + reader["Country"].ToString() == ", ")
        {
          rowAddress = "No registered address";
        }
        employees.Add(
          new UserModelSummarized
          {
            FullName = reader["FirstName"].ToString() + " " + reader["LastName"].ToString() + " " + reader["LastName2"].ToString(),
            Identification = reader["Identification"].ToString(),
            Email = reader["Email"].ToString(),
            Phone = reader["Phone"].ToString(),
            Address = rowAddress
          });
      }
      connection.Close();

      return employees;
    }

    public List<UserModelSummarized> GetEmployeesNotInProject(string projectName, string employerID)
    {
      // Make consult to database
      string consult = "EXEC GetEmployeesNotWorkingOnProject @projectName = @thisProjectName, @employerID = @thisEmployerID";
      var queryCommand = new SqlCommand(consult, connection);

      // Uses user's email to get their ID
      queryCommand.Parameters.AddWithValue("@thisProjectName", projectName);
      queryCommand.Parameters.AddWithValue("@thisEmployerID", employerID);

      List<UserModelSummarized> employees = new List<UserModelSummarized>();

      connection.Open();
      SqlDataReader reader = queryCommand.ExecuteReader();
      while (reader.Read())
      {
        var rowAddress = "";
        if (reader["State"].ToString() != "" && reader["Country"].ToString() != "")
        {
          rowAddress = reader["State"].ToString() + ", " + reader["Country"].ToString();
        }
        else if (reader["State"].ToString() == "" && reader["Country"].ToString() != "")
        {
          rowAddress = "No registered State" + ", " + reader["Country"].ToString();
        }
        else if (reader["State"].ToString() != "" && reader["Country"].ToString() == "")
        {
          rowAddress = reader["State"].ToString() + ", " + "No registered Country";
        }
        else if (reader["State"].ToString() + ", " + reader["Country"].ToString() == ", ")
        {
          rowAddress = "No registered address";
        }
        employees.Add(
          new UserModelSummarized
          {
            FullName = reader["FirstName"].ToString() + " " + reader["LastName"].ToString() + " " + reader["LastName2"].ToString(),
            Identification = reader["Identification"].ToString(),
            Email = reader["Email"].ToString(),
            Phone = reader["Phone"].ToString(),
            Address = rowAddress
          });
      }
      connection.Close();

      return employees;
    }

    public ContractModel GetSpecificContract(string projectName, string employerID, string employeeID)
    {
      string consult = @"SELECT ProjectName, EmployerID, EmployeeID, StartDate, ExpectedEndingDate, Position, Schedule, NetSalary, ContractType
                      FROM Contracts
                      WHERE ProjectName = @projectName AND EmployerID = @employerID AND EmployeeID = @employeeID";
      var contract = new ContractModel();
      SqlCommand queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@projectName", projectName);
      queryCommand.Parameters.AddWithValue("@employerID", employerID);
      queryCommand.Parameters.AddWithValue("@employeeID", employeeID);

      SqlDataAdapter tableAdapter = new SqlDataAdapter(queryCommand);
      DataTable tableFormatConsult = CreateTableConsultContract(tableAdapter);
      foreach (DataRow column in tableFormatConsult.Rows)
      {
        contract.projectName = Convert.ToString(column["ProjectName"]);
        contract.employerID = Convert.ToString(column["EmployerID"]);
        contract.employeeID = Convert.ToString(column["EmployeeID"]);
        contract.startDate = Convert.ToString(column["StartDate"]);
        contract.expectedEndingDate = Convert.ToString(column["ExpectedEndingDate"]);
        contract.position = Convert.ToString(column["Position"]);
        contract.schedule = Convert.ToString(column["Schedule"]);
        contract.netSalary = Convert.ToString(column["NetSalary"]);
        contract.contractType = Convert.ToString(column["ContractType"]);
      };
      return contract;
    }

    public List<HourRegistrationModel> GetHours(string projectName, string employerID)
    {
      var lastPaymentDate = "";
      var consult = @"SELECT TOP 1 PaymentDate FROM Payments WHERE ProjectName = @projectName AND EmployerID = @employerID ORDER BY PaymentDate DESC";
      var queryCommand = new SqlCommand(consult, connection);

      queryCommand.Parameters.AddWithValue("@projectName", projectName);
      queryCommand.Parameters.AddWithValue("@employerID", employerID);

      connection.Open();
      SqlDataReader reader = queryCommand.ExecuteReader();
      while (reader.Read())
      {
        lastPaymentDate = reader["PaymentDate"].ToString();
      }
      connection.Close();

      List<HourRegistrationModel> entries = new List<HourRegistrationModel>();
      consult = @"SELECT ProjectName, EmployerID, EmployeeID, Date, NumberOfHours, HoursApprovalStatus
                      FROM HoursRegistry
                      WHERE ProjectName = @projectName AND EmployerID = @employerID AND Date > Convert(datetime, @lastPaymentDate)
                      OR ProjectName = @projectName AND EmployerID = @employerID AND HoursApprovalStatus = 0
                      ORDER BY EmployeeID, Date";
      queryCommand = new SqlCommand(consult, connection);

      queryCommand.Parameters.AddWithValue("@projectName", projectName);
      queryCommand.Parameters.AddWithValue("@employerID", employerID);
      queryCommand.Parameters.AddWithValue("@lastPaymentDate", lastPaymentDate.Split(' ')[0].Split('/')[2] + "-" + lastPaymentDate.Split(' ')[0].Split('/')[1] + "-" + lastPaymentDate.Split(' ')[0].Split('/')[0]);

      connection.Open();
      reader = queryCommand.ExecuteReader();
      while (reader.Read())
      {
        entries.Add(
          new HourRegistrationModel
          {
            projectName = reader["ProjectName"].ToString(),
            employerID = reader["EmployerID"].ToString(),
            employeeID = reader["EmployeeID"].ToString(),
            date = reader["Date"].ToString(),
            numberOfHours = reader["NumberOfHours"].ToString(),
            hoursApprovalStatus = reader["HoursApprovalStatus"].ToString()
          }
        );
      }
      connection.Close();

      return entries;
    }

    public void CreateEmployee(UserModel employee)
    {
      string consult = "insert into Users ([FirstName], [LastName], [LastName2], [Identification], [Email], [Password], [Country], [State], [City], [Address], [ZipCode], [UserType], [Phone]) values (@FirstName, @LastName, @LastName2, @Identification, @Email, @Password, @Country, @State, @City, @Address, @ZipCode, @UserType, @Phone)";
      SqlCommand queryCommand = new SqlCommand(consult, connection);

      // Add mandatory parameters
      queryCommand.Parameters.AddWithValue("@FirstName", employee.FirstName);
      queryCommand.Parameters.AddWithValue("@LastName", employee.LastName);
      queryCommand.Parameters.AddWithValue("@Identification", employee.Identification);
      queryCommand.Parameters.AddWithValue("@Email", employee.Email);
      queryCommand.Parameters.AddWithValue("@Password", employee.Password);
      queryCommand.Parameters.AddWithValue("@UserType", 1);
      queryCommand.Parameters.AddWithValue("@Phone", employee.Phone);

      // Add optional parameters
      if (employee.LastName2 != null && employee.LastName2 != "")
      {
        queryCommand.Parameters.AddWithValue("@LastName2", employee.LastName2);
      }
      else
      {
        queryCommand.Parameters.AddWithValue("@LastName2", DBNull.Value);
      }
      if (employee.Country != null && employee.Country != "")
      {
        queryCommand.Parameters.AddWithValue("@Country", employee.Country);
      }
      else
      {
        queryCommand.Parameters.AddWithValue("@Country", DBNull.Value);
      }
      if (employee.State != null && employee.State != "")
      {
        queryCommand.Parameters.AddWithValue("@State", employee.State);
      }
      else
      {
        queryCommand.Parameters.AddWithValue("@State", DBNull.Value);
      }
      if (employee.City != null && employee.City != "")
      {
        queryCommand.Parameters.AddWithValue("@City", employee.City);
      }
      else
      {
        queryCommand.Parameters.AddWithValue("@City", DBNull.Value);
      }
      if (employee.Address != null && employee.Address != "")
      {
        queryCommand.Parameters.AddWithValue("@Address", employee.Address);
      }
      else
      {
        queryCommand.Parameters.AddWithValue("@Address", DBNull.Value);
      }
      if (employee.ZipCode != null && employee.ZipCode != "")
      {
        queryCommand.Parameters.AddWithValue("@ZipCode", employee.ZipCode);
      }
      else
      {
        queryCommand.Parameters.AddWithValue("@ZipCode", DBNull.Value);
      }
      connection.Open();
      queryCommand.ExecuteNonQuery();
      connection.Close();
    }

    public void CreateEmployer(UserModel employer)
    {
      string consult = "insert into Users ([FirstName], [LastName], [LastName2], [Identification], [Email], [Password], [Country], [State], [City], [Address], [ZipCode], [UserType], [Phone]) values (@FirstName, @LastName, @LastName2, @Identification, @Email, @Password, @Country, @State, @City, @Address, @ZipCode, @UserType, @Phone)";
      SqlCommand queryCommand = new SqlCommand(consult, connection);

      // Add mandatory parameters
      queryCommand.Parameters.AddWithValue("@FirstName", employer.FirstName);
      queryCommand.Parameters.AddWithValue("@LastName", employer.LastName);
      queryCommand.Parameters.AddWithValue("@Identification", employer.Identification);
      queryCommand.Parameters.AddWithValue("@Email", employer.Email);
      queryCommand.Parameters.AddWithValue("@Password", employer.Password);
      queryCommand.Parameters.AddWithValue("@UserType", 0);
      queryCommand.Parameters.AddWithValue("@Phone", employer.Phone);

      // Add optional parameters
      if (employer.LastName2 != null && employer.LastName2 != "")
      {
        queryCommand.Parameters.AddWithValue("@LastName2", employer.LastName2);
      }
      else
      {
        queryCommand.Parameters.AddWithValue("@LastName2", DBNull.Value);
      }
      if (employer.Country != null && employer.Country != "")
      {
        queryCommand.Parameters.AddWithValue("@Country", employer.Country);
      }
      else
      {
        queryCommand.Parameters.AddWithValue("@Country", DBNull.Value);
      }
      if (employer.State != null && employer.State != "")
      {
        queryCommand.Parameters.AddWithValue("@State", employer.State);
      }
      else
      {
        queryCommand.Parameters.AddWithValue("@State", DBNull.Value);
      }
      if (employer.City != null && employer.City != "")
      {
        queryCommand.Parameters.AddWithValue("@City", employer.City);
      }
      else
      {
        queryCommand.Parameters.AddWithValue("@City", DBNull.Value);
      }
      if (employer.Address != null && employer.Address != "")
      {
        queryCommand.Parameters.AddWithValue("@Address", employer.Address);
      }
      else
      {
        queryCommand.Parameters.AddWithValue("@Address", DBNull.Value);
      }
      if (employer.ZipCode != null && employer.ZipCode != "")
      {
        queryCommand.Parameters.AddWithValue("@ZipCode", employer.ZipCode);
      }
      else
      {
        queryCommand.Parameters.AddWithValue("@ZipCode", DBNull.Value);
      }
      connection.Open();
      queryCommand.ExecuteNonQuery();
      connection.Close();
    }

    public void AddEmployeeToProject(ContractModel contract)
    {
      var consult = @"INSERT INTO Contracts ([ProjectName], [EmployerID], [EmployeeID], [StartDate], [ExpectedEndingDate], [RealEndedDate], [Position], [Schedule], [NetSalary], [ContractType]) 
                      VALUES (@projectName, @employerID, @employeeID, @startDate, @expectedEndingDate, @realEndedDate, @position, @schedule, @netSalary, @contractType)";
      var queryCommand = new SqlCommand(consult, connection);

      // Insertion of attribute
      queryCommand.Parameters.AddWithValue("@projectName", contract.projectName);
      queryCommand.Parameters.AddWithValue("@employerID", contract.employerID);
      queryCommand.Parameters.AddWithValue("@employeeID", contract.employeeID);
      queryCommand.Parameters.AddWithValue("@startDate", contract.startDate);
      queryCommand.Parameters.AddWithValue("@expectedEndingDate", contract.expectedEndingDate);
      queryCommand.Parameters.AddWithValue("@realEndedDate", DBNull.Value);
      queryCommand.Parameters.AddWithValue("@position", contract.position);
      queryCommand.Parameters.AddWithValue("@schedule", contract.schedule);
      queryCommand.Parameters.AddWithValue("@netSalary", contract.netSalary);
      queryCommand.Parameters.AddWithValue("@contractType", contract.contractType);

      connection.Open();
      queryCommand.ExecuteNonQuery();
      connection.Close();
    }

    public void RegisterHours(HourRegistrationModel hours)
    {
      var consult = @"INSERT INTO HoursRegistry ([ProjectName], [EmployerID], [EmployeeID], [Date], [NumberOfHours], [HoursApprovalStatus]) 
                      VALUES (@projectName, @employerID, @employeeID, @date, @numberOfHours, 0)";
      var queryCommand = new SqlCommand(consult, connection);

      // Insertion of attribute
      queryCommand.Parameters.AddWithValue("@projectName", hours.projectName);
      queryCommand.Parameters.AddWithValue("@employerID", hours.employerID);
      queryCommand.Parameters.AddWithValue("@employeeID", hours.employeeID);
      queryCommand.Parameters.AddWithValue("@date", hours.date);
      queryCommand.Parameters.AddWithValue("@numberOfHours", hours.numberOfHours);

      connection.Open();
      queryCommand.ExecuteNonQuery();
      connection.Close();
    }

    public void ManageHours(HourRegistrationModel hours)
    {
      // Prepare command
      string consult = "UPDATE HoursRegistry SET [HoursApprovalStatus] = @hoursApprovalStatus WHERE [ProjectName] = @projectName AND [EmployerID] = @employerID AND [EmployeeID] = @employeeID AND [Date] = @date";
      SqlCommand queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@hoursApprovalStatus", hours.hoursApprovalStatus);
      queryCommand.Parameters.AddWithValue("@projectName", hours.projectName);
      queryCommand.Parameters.AddWithValue("@employerID", hours.employerID);
      queryCommand.Parameters.AddWithValue("@employeeID", hours.employeeID);
      queryCommand.Parameters.AddWithValue("@date", hours.date);

      // Execute command
      connection.Open();
      queryCommand.ExecuteNonQuery();
      connection.Close();
    }

    public DataTable GetEmployeeInfo(ReciberModel id)
    {
      string consult = "select Identification, FirstName, LastName, LastName2, Email, Country, State, City, ZipCode, Address, Phone from Users where Identification = @id";
      SqlCommand queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@id", id.id.Substring(0, 10));

      SqlDataAdapter tableAdapter = new SqlDataAdapter(queryCommand);
      DataTable tableResult = CreateTableConsultContract(tableAdapter);

      return tableResult;
    }

    public DataTable ViewEmployeeInfo(string id)
    {
      string consult = "select Identification, FirstName, LastName, LastName2, Email, Country, State, City, ZipCode, Address, Phone from Users where Identification =  @id";
      SqlCommand queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@id", id.Substring(0, 10));

      SqlDataAdapter tableAdapter = new SqlDataAdapter(queryCommand);
      DataTable tableResult = CreateTableConsultContract(tableAdapter);

      return tableResult;
    }

    public void UpdateEmployeeInfo(UserEmployeeInfoToModify info)
    {
      // Prepare command
      string consult = "update Users set [Email] = @Email, [Country] = @Country, [State] = @State, [City] = @City, [Address] = @Address, [ZipCode] = @ZipCode, [Phone] = @Phone where [Identification] = @Identification";
      SqlCommand queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@Email", info.Email);
      queryCommand.Parameters.AddWithValue("@Country", info.Country);
      queryCommand.Parameters.AddWithValue("@State", info.State);
      queryCommand.Parameters.AddWithValue("@City", info.City);
      queryCommand.Parameters.AddWithValue("@Address", info.Address);
      queryCommand.Parameters.AddWithValue("@ZipCode", info.ZipCode);
      queryCommand.Parameters.AddWithValue("@Phone", info.Phone);
      queryCommand.Parameters.AddWithValue("@Identification", info.Identification);

      // Add optional parameters
      if (info.Password != null && info.Password != "")
      {
        UpdatePassword(info.Identification, info.Password);
      }
      // Execute command
      connection.Open();
      queryCommand.ExecuteNonQuery();
      connection.Close();
    }

    private void UpdatePassword(string identification, string newPassowrd)
    {
      // Prepare command
      string consult = "update Users set [Password] = @Password where [Identification] = @Identification";
      SqlCommand queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@Password", newPassowrd);
      queryCommand.Parameters.AddWithValue("@Identification", identification);

      // Execute command
      connection.Open();
      queryCommand.ExecuteNonQuery();
      connection.Close();
    }

    public void DeleteEmployee(string identification)
    {
      // Prepare command
      string consult = "execute delete_employee @Identification";
      SqlCommand queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@Identification", identification);

      // Execute command
      connection.Open();
      queryCommand.ExecuteNonQuery();
      connection.Close();
    }

    public void DeleteEmployeeFromProject(string projectName, string id)
    {
      // Prepare command
      string consult = @"UPDATE Contracts
                        SET RealEndedDate = @date 
                        WHERE ProjectName = @projectName AND EmployeeID = @employeeID";
      SqlCommand queryCommand = new SqlCommand(consult, connection);
      queryCommand.Parameters.AddWithValue("@date", DateTime.Now.ToString("yyyy/MM/dd"));
      queryCommand.Parameters.AddWithValue("@projectName", projectName);
      queryCommand.Parameters.AddWithValue("@employeeID", id);

      // Execute command
      connection.Open();
      queryCommand.ExecuteNonQuery();
      connection.Close();
    }
  }
}
