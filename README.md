# schoolcare
A USSD API for students to get their Fee Balance and Results per year and semester using their Admission ID

Deployed on render at: [learnhq-ussd](https://learnhq-ussd.onrender.com/)

It is linked to a [learning management system](https://lms-adm.netlify.app) database to access students data <br>
You can link it to your API and modify it to your needs 

To try it out, use [africastalking app](https://play.google.com/store/apps/details?id=com.africastalking.sandbox) USSD service.  
Dial USSD:

```
*384*32325#
```

## methods

Default request returns a prompt:  
```
What would you like to check
      1. Results
      2. Fee Balance
      3. Classes Today
```
You can select any of the options and you will be prompted for Admission ID  
```
Enter admission number
```
After entering valid ADMISSION NUMBER, system displays fee balance,  results or Lessons based upon selection made earlier

