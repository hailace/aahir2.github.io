"use strict";

// IIFE - Immediately invoked functional expression
(function(){

    function CheckLogin(){
        if (sessionStorage.getItem("user")){
            $("#login").html(`<a id="logout" class="nav-link" href="#">
<i class="fas fa-undo"></i>Logout</a>`);
        }

        $("#logout").on("click", function (){
            sessionStorage.clear();
            location.href = "index.html";
        });
    }

    function LoadHeader(html_data) {
        $("header").html(html_data);
        $(`li>a:contains(${document.title})`)
            .addClass("active")
            .attr("aria-current", "page");
        CheckLogin();
    }

    function AjaxRequest(method, url, callback){
        //STEP 1 initialize xhr object
        let xhr = new XMLHttpRequest();


        // step 4 add the event listener to monitor
        xhr.addEventListener("readystatechange", () =>{

            if(xhr.readyState === 4 && xhr.status === 200){
                if(typeof callback == "function"){
                    callback(xhr.responseText);
                }else{
                    console.error("error callback not a function");
                }
            }

        });
        // step 2 open a connection to the server
        xhr.open(method, url);
        //send the request
        xhr.send();
    }

    function ContactFormValidation(){
        Validatefield("#fullName", /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/, "please enter a validate first name and last name ");

        Validatefield("#contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/, "please enter a validate Contact Number ");

        Validatefield("#emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, "please enter a validate Email Address ");
    }

    /**
     * this function validate input for contact and edit pages.
     */




    function Validatefield(input_field_id, regular_expression, error_message){
        let messageArea = $("#messageArea").hide();


        $(input_field_id).on("blur", function () {
            let inputFieldText = $(this).val();
            if (!regular_expression.test(inputFieldText)){
                 //fail validation
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text(error_message).show();
            }else{
                //pass validation
                messageArea.removeClass("class").hide();
            }
        });

    }




    function  AddContact(fullName, contactNumber, emailAddress){
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()){
            let key = contact.fullName.substring(0.1) + Date.now();
            localStorage.setItem(key, contact.serialize());
        }
    }
    function DisplayHomePage() {

        console.log("Called DisplayHomePage...");

        $("#AboutUsBtn").on("click", () =>{
            location.href = "about.html";
        });

        $("main").append(`<p id="MainParagraph"
        class="mt-3">this ia my first paragraph</p>`);



        $("body").append(`<article class="container">
                            <p id="ArticleParagraph" class="mt-3">
                            this is my article paragraph</p></article>`)



    }
    function DisplayProductsPage() {
        console.log("Called DisplayProductsPage...");
    }
    function DisplayServicesPage()
    {
        console.log("Called DisplayServicesPage...");
    }
    function DisplayAboutPage()
    {
        console.log("Called DisplayAboutPage...");
    }
    function DisplayContactPage(){

        console.log("Called DisplayContactPage...");

        ContactFormValidation()
        //TestFullName();

        let sendbutton =
            document.getElementById("sendbutton");
        let subcsribeCheckbox =
            document.getElementById("subscribecheckbox");

        sendbutton.addEventListener("click", function (){

            if(subcsribeCheckbox.checked){
                AddContact(fullName.value, contactNumber.value, emailAddress.value);



            }
        });
    }

    function DisplayContactListPage()
    {
        console.log("Called DisplayContactListPage...");

        if(localStorage.length > 0){
            let contactList =  document.getElementById("contactList");
            let data = "";
            let index = 1;
            let keys = Object.keys(localStorage);
            for (const key of keys){
                let contact = new core.Contact();
                let contactData = localStorage.getItem(key);
                contact.deserialize(contactData);
                data += `<tr><th scope="row" class="text-center">${index}</th>
                         <td>${contact.fullName}</td>
                         <td>${contact.contactNumber}</td>
                         <td>${contact.emailAddress}</td>
                         <td>
                         <button value="${key}" class="btn btn-primary btn-sm edit">
                             <i class="fas fa-edit fa-lang">Edit</i>
                         </button>
                         </td>
                          <td>
                         <button value="${key}" class="btn btn-primary btn-sm delete">
                             <i class="fas fa-trash fa-lang">Delete</i></button></td>
                         <td></td>
                         </tr>`;
                index++;
            }
            contactList.innerHTML = data;
        }
        $("#addButton").on("click", ()=> {
            location.href = "edit.html#add"
        });
        $("button.edit").on("click", function (){
            location.href = "edit.html#" + $(this).val();
        });
        $("button.delete").on("click", function (){
            if(confirm("Confirm contact Delete?")){
                localStorage.removeItem($(this).val());
            }
            location.href = "contact-list.html";
        });

    }

    function DisplayEditPage(){
    console.log("called DisplayEditPage()...");

        ContactFormValidation()

    let page = location.hash.substring(1);
    switch(page) {
        case "add":

            $("main>h1").text("Add Contact");
            $("#editButton").html(`<i class="fa fa-plus fa-sm">Add`);

            $("#editButton").on("click", (event) => {

                //prevent form submission
                event.preventDefault();

                AddContact(fullName.value, contactNumber.value, emailAddress.value);
                location.href = "contact-list.html";

            });

            $("#cancelButton").on("click", () => {
                location.href = "contact-list.html";
            })
            break;
        default:
            //edit operation

            let contact = new core.Contact();
            contact.deserialize(localStorage.getItem(page));

            $("#fullName").val(contact.fullName);
            $("#contactNumber").val(contact.contactNumber);
            $("#emailAddress").val(contact.emailAddress);
            $("#editButton").on("click", (event) => {

                //prevent form submission
                event.preventDefault();
                contact.fullName = $("#fullName").val();
                contact.contactNumber = $("#contactNumber").val();
                contact.emailAddress = $("#emailAddress").val();

                localStorage.setItem(page, contact.serialize());
                location.href = "contact-list.html";

            });
            $("#cancelButton").on("click", () => {
                location.href = "contact-list.html";
            });


            break;

    }
    }

    function DisplayLoginPage()
    {
        console.log("Called DisplayLoginPage...");
        let messageArea = $("#messageArea");

        $("#loginButton").on("click", function (){

            let success = false;
            let newUser = new core.User();

            $.get("./data/users.json", function (data){

                for(const user of data.users){

                   console.log(user);
                   if(username.value === user.UserName && password.value === user.Password){

                       newUser.fromJSON(user);
                       success = true;
                       break;
                   }
                }

                if(success){
                    sessionStorage.setItem("user", newUser.serialize());
                    messageArea.removeAttr("class").hide();
                    location.href = "contact-list.html";

                }else{

                    $("#username").trigger("focus").trigger("select");
                    messageArea
                        .addClass("alert alert-danger")
                        .text("Error: Invalid Credentials")
                        .show();

                }

            });
        });

        $("#cancelButton").on("click", function (){
            document.forms[0].reset();
            location.href = "index.html";
        });
    }

    function DisplayRegisterPage()
    {
        console.log("Called DisplayRegisterPage...");
    }

    function Start(){
        console.log("App Started...");

        AjaxRequest("GET", "header.html", LoadHeader);

        switch(document.title)
        {
            case "Home":
                DisplayHomePage();
                break;
            case "Products":
                DisplayProductsPage();
                break;
            case "Services":
                DisplayServicesPage();
                break;
            case "About Us":
                DisplayAboutPage();
                break;
            case "Contact Us":
                DisplayContactPage();
                break;
            case "Contact List":
                DisplayContactListPage();
                break;
            case "Edit Contact":
                DisplayEditPage();
                break;
            case "Login Contact":
                DisplayLoginPage();
                break;
            case "Register Contact":
                DisplayRegisterPage();
                break;
        }
    }

    window.addEventListener("load", Start);

})();
