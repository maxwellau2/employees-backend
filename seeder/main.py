import os
from faker import Faker
from random import randint
import requests

URI = "http://localhost:3000/api/employee/"

sess = requests.Session()
# please create the account as shown here -------------------************
res = sess.post("http://localhost:3000/users/login", json={"username": "admin", "password": "Admin1!"})
cookie = requests.utils.dict_from_cookiejar(res.cookies)
print(cookie)
# sess.cookies.update(res.cookies)
cookie = sess.cookies.items()[0][1]
print(cookie)
# os.abort()
def mock_employees(number_of_employees: int):
    # fake name generator
    fake = Faker()
    # set base urlSS
    available_departments = ["HR", "PS"]
    for i in range(0,number_of_employees):
        data = {}
        data["name"] = fake.name()
        data["salary"] = randint(8000000,15000000)/100
        data["department"] = available_departments[randint(0,1)]
        response = sess.post(URI, json=data,cookies={'token':cookie})
        print(response.json())
    print("done~")

def delete_all_employees():
    # get all employee ids first
    response = sess.get(URI, cookies={'token':cookie}).json()
    ids = []
    for i in response:
        ids.append(i["id"])
    # print(ids)
    # iteratively delete all
    for i in ids:
        response = sess.delete(f"{URI}{i}", cookies={'token':cookie})
        print(response.json())


# delete_all_employees()
mock_employees(66)