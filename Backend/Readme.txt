Thread Schema
   Thread Id
   Title
   Message
   Created At
   Updated At

Message Schema  
      Content
      Role - User , Assistant
      Timestamp


Routes:chat.js
. GET /thread   -> thread return all 
. GET /threadId  -> 1 specfic thread le Message return krega
. DELETE / thread /:threadId   -> DELETE
. POST /chat - >meseege +reply pairin store database important routes


🟠 1. What is MODEL (Mongoose Model)?
Model = Database structure + rules
      

🟠 2. What is ROUTE?
Route = API endpoints 
Client (React / Postman) sends requests 

Route handles those requests

🟠 1. What is UTILS?
Utils = Helper functions

Reusable code

किसी एक specific काम के लिए functions

Example utils:

Password hashing

JWT token generate

Date formatting
File upload helper
API request 



🟠 What is Context
Context = previous conversation memory
jab tum AI ko sirf ek Message doge to wo  sirf uss Message ka reply dega
But agar tum poori previous chat history bhejte ho model ko, to AI samajh paata hai ki baat kaha se start hui thi aur ab kya chal raha hai.

❌ Without context:

AI randomly answer karega

Continuity nahi hogi

Conversation break ho jayegi

✔ With context:

AI previous messages remember karta

Same topic continue hota

Natural conversation feel hoti