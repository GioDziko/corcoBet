# Crocobet Project 👩‍💻

# ინსტრუქცია 👩‍💻

- რეპოს დაკლონვის შემდეგ შექმენით .env ფაილი და მიყევით .env.example ფაილში მოცემულ ინსტრუქციას
- რუთ დირექტორიაში გაუშვით ქომანდი npm install
- მას შემდეგ რაც შეიქმნება node_modules ფოლდერი გაუშვით ქომანდი npm start.
- სვაგერის დოკუმენტაციის სანახავად გადადით /api-docs

# აუთენთიფიკაცია/ავტორიზაცია 👩‍💻

## აუთენთიფიკაცია 👩‍💻

- რადგან api ყველა როუთი დაცულია, აუცილებელია რომ მის გამოსაყენებლად გაიაროთ აუთენთიფიკაცია.

- თავდაპირველად ბაზაში დაგხვდებათ მომხმარებელი email:random@gmail.com password:random123

- /api/v1/auth/login როუთზე გააგზავნეთ რექვესთი რომლის ტანშიც ჩასვამთ შესაბამის მონაცემებს, საწყის შემთხვევაში:

email:random@gmail.com password:random123

- მიღებული ტოკენი გამოიყენეთ სამომავლოდ ავტორიზაციისთვის.

## ავტორიზაცია 👩‍💻

- ავტორიზაციისთვის, აპლიკაციაში გამოყენებულია Bearer პატერნი.
- api გამოსაყენებლად ყოველი რექვესთის დროს ჰედერში გაატანეთ Authorization პარამეტრი ავტორიზაციისთვის.

მაგ: Authorization - Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiY2h1a3VyYTFAZ21haWwuY29tIiwiaWF0IjoxNzA4MDc4OTMwLCJleHAiOjE3MDgxNjUzMzB9.a1mQpAnh2z1Uopknt4S1hjrzGjH25P5277izBIyLeiU

## ახალი მომხმარებლის რეგისტრაცია 👩‍💻

- ახალი მომხმარებლის დასარეგისტრირებლად გამოიყენეთ /api/v1/auth/register
