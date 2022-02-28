# Distributed Vaccionation System

The idea of this project is to replicate a system for register vaccinated people, this will be achieve thorught a series of router (state, distric and town) these are
interconnected between them and this is done by a script. This project is program in C++/C and Python.

## Hot to execute:
1. Run the infraestrcture:
   
    Open a terminal from the project directory and run:
    ```bash
    ./network_script numberStates numberDistrictsPerState numberTownsPerDistrict
    ```
    Please note that the number of states, districts and towns has no maximum and only limited to a minumum of two, however please consider that after 10 states the computational power to run this is going to be very high.
    This script will open a **new terminal per each router**.

2. Run the client:
    1. To connect the client you must run the AuthenticationServer by `python3 AuthenticationServer.py`. Use data/credentials.csv file to see available credentials.
    2. Run the client by `client.py`.
    3. You will receive instructions to upload the info of vaccinated people in the data/vaccinated_people.csv file. This will be distributed to the other router.