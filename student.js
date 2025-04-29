// Constants
const DB_NAME = "SCHOOL-DB";
const RELATION_NAME = "STUDENT-TABLE";
const BASE_URL = "http://api.login2explore.com:5577";
const JPDB_IRL = "/api/irl";
const JPDB_IML = "/api/iml";
const CONNECTION_TOKEN = "90934713|-31949208391908896|90956281";

// Utility functions
function disableAllFields() {
    $("#fullname, #class, #birthdate, #address, #enrollDate").prop("disabled", true);
}

function enableAllFields() {
    $("#fullname, #class, #birthdate, #address, #enrollDate").prop("disabled", false);
}

function resetForm() {
    $("#rollno").val("").prop("disabled", false);
    $("#fullname, #class, #birthdate, #address, #enrollDate").val("").prop("disabled", true);
    $("#save, #update, #reset").prop("disabled", true);
    $("#rollno").focus();
}

// Save record number to local storage
function saveRecNoToLS(jsonObj) {
    let data = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", data.rec_no);
}

// Prepare JSON for primary key
function getRollNoAsJsonObj() {
    let rollno = $("#rollno").val();
    return JSON.stringify({ Roll_No: rollno });
}

// Fill form with data from DB
function fillData(jsonObj) {
    saveRecNoToLS(jsonObj);
    let record = JSON.parse(jsonObj.data).record;
    $("#fullname").val(record.Full_Name);
    $("#class").val(record.Class);
    $("#birthdate").val(record.Birth_Date);
    $("#address").val(record.Address);
    $("#enrollDate").val(record.Enrollment_Date);
}

// On primary key change
function getStudent() {
    let rollJsonObj = getRollNoAsJsonObj();
    let getRequest = createGET_BY_KEYRequest(CONNECTION_TOKEN, DB_NAME, RELATION_NAME, rollJsonObj);
    jQuery.ajaxSetup({ async: false });
    let resJsonObj = executeCommandAtGivenBaseUrl(getRequest, BASE_URL, JPDB_IML);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
    $("#save").prop("disabled", false);
    $("#reset").prop("disabled", false);
    
    // Enable all input fields
    $("#fullname").prop("disabled", false);
    $("#class").prop("disabled", false);
    $("#birthdate").prop("disabled", false);
    $("#address").prop("disabled", false);
    $("#enrollDate").prop("disabled", false);
    $("#fullname").focus();
    } else if (resJsonObj.status === 200) {
        fillData(resJsonObj);
        $("#rollno").prop("disabled", true);
        $("#update, #reset").prop("disabled", false);
        enableAllFields();
        $("#fullname").focus();
    }
}

// Validate data
function validateData() {
    let rollno = $("#rollno").val();
    let fullname = $("#fullname").val();
    let sclass = $("#class").val();
    let bdate = $("#birthdate").val();
    let address = $("#address").val();
    let edate = $("#enrollDate").val();

    if (!rollno || !fullname || !sclass || !bdate || !address || !edate) {
        alert("All fields are required!");
        return "";
    }

    return JSON.stringify({
        Roll_No: rollno,
        Full_Name: fullname,
        Class: sclass,
        Birth_Date: bdate,
        Address: address,
        Enrollment_Date: edate
    });
}

// Save data
function saveStudent() {
    let jsonStr = validateData();
    if (!jsonStr) return;

    let putRequest = createPUTRequest(CONNECTION_TOKEN, jsonStr, DB_NAME, RELATION_NAME);
    jQuery.ajaxSetup({ async: false });
    let resJsonObj = executeCommandAtGivenBaseUrl(putRequest, BASE_URL, JPDB_IML);
    jQuery.ajaxSetup({ async: true });
    resetForm();
}

// Update data
function updateStudent() {
    let jsonStr = validateData();
    if (!jsonStr) return;

    let updateRequest = createUPDATERecordRequest(CONNECTION_TOKEN, jsonStr, DB_NAME, RELATION_NAME, localStorage.getItem("recno"));
    jQuery.ajaxSetup({ async: false });
    let resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, BASE_URL, JPDB_IML);
    jQuery.ajaxSetup({ async: true });
    resetForm();
}

// Reset data
function resetData() {
    resetForm();
}



