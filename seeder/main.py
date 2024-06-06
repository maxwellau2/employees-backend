from faker import Faker
from random import randint
import requests

URI = "http://localhost:3000/employee/"

def mock_employees(number_of_employees: int):
    # fake name generator
    fake = Faker()
    # set base urlSS
    available_departments = ["HR", "PS"]
    for i in range(0,number_of_employees):
        data = {}
        data["name"] = fake.name()
        data["salary"] = randint(80000,150000)
        data["department"] = available_departments[randint(0,1)]
        response = requests.post(URI, json=data)
        print(response.json())
    print("done~")

def delete_all_employees():
    # get all employee ids first
    response = requests.get(URI).json()
    ids = []
    for i in response:
        ids.append(i["id"])
    # print(ids)
    # iteratively delete all
    for i in ids:
        response = requests.delete(f"{URI}{i}")
        print(response.json())


# delete_all_employees()
mock_employees(31)