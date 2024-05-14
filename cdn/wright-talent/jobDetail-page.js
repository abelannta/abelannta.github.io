const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const jobId = urlParams.get("id");

if (!jobId) {
  window.location.href = "https://wright-talent.webflow.io/jobs";
}

let fetchJob = async () => {
  try {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization:
          "Basic 813438d5227b9ea7eb3df82ec03b89a69d5585aa486a6cd52add3bb1081270ebcdd7850721798ac47139770f1d0a910af958cf7e543b2a29c6164c446343f446fca0633d8003239a150f86edd7ca693ba2477c72e725ab5202aafbdedcd4b226c31cdefb9aea7540afbae847a8f0aab6dc6248ff6fe507ebd52bec4fd1dc2c99",
      },
    };

    const response = await fetch(
      "https://app.loxo.co/api/wright-talent/jobs/" + jobId,
      options
    );
    const data = await response.json();

    const skeletonElements = document.querySelectorAll("[ms-code-skeleton]");

    skeletonElements.forEach((element) => {
      // Get delay from the attribute
      let delay = element.getAttribute("ms-code-skeleton");

      // If attribute value is not a number, set default delay as 2000ms
      if (isNaN(delay)) {
        delay = 2000;
      }

      setTimeout(() => {
        // Remove the skeleton loader div after delay
        const skeletonDiv = element.querySelector(".skeleton-loader");
        element.removeChild(skeletonDiv);
      }, delay);
    });

    return data;
  } catch (error) {
    return [];
  }
};

const job = await fetchJob();
console.log(job);

document.querySelector('#jobDetail [data-element="job-title"]').textContent =
  job.title;
document.querySelector('#jobDetail [data-element="job-address"]').textContent =
  job.address;
document.querySelector('#jobDetail [data-element="job-city"]').textContent =
  job.city;
document.querySelector(
  '#jobDetail [data-element="job-description"]'
).innerHTML = job.description;
document.querySelector('#jobDetail [data-element="owner"]').textContent =
  job.owners[0].name;
// document.querySelector('#jobDetail [data-element="owner-photo"]').setAttribute("src", job.owners[0].avatar_original_url);
document.querySelector('#jobDetail [data-element="email"]').textContent =
  job.owners[0].email;
document.querySelector('#jobDetail [data-element="phone"]').textContent =
  job.owners[0].phone;
document.querySelector('#jobDetail [data-element="job-category"]').textContent =
  job.category === null ? "Others" : job.category.name;
document.querySelector('#jobDetail [data-element="job-company"]').textContent =
  job.company === null ? "-" : job.company.name;
document.querySelector('#jobDetail [data-element="job-type"]').textContent =
  job.job_type.name;
document.querySelector('#jobDetail [data-element="job-salary"]').textContent =
  job.salary;
document.querySelector('#jobDetail [data-element="job-date"]').textContent =
  moment(job.published_at).startOf("day").fromNow();
document.querySelector('#jobDetail [data-element="job-due-date"]').textContent =
  job.published_end_date ? moment(job.published_end_date).format("LL") : "-";

// Apply Job Function
document.addEventListener("DOMContentLoaded", function () {
  const inputElement = document.querySelector(
    'input[type="file"][name="fileToUpload"]'
  );
  const pond = FilePond.create(inputElement, {
    credits: false,
    name: "fileToUpload",
    storeAsFile: true,
  });

  Webflow.push(function () {
    $("#wf-form-Form-Apply-Job").submit(function (e) {
      e.preventDefault();

      if (!pond.getFile().file) return;

      const form = new FormData();
      form.append("email", document.getElementById("Email").value);
      form.append("name", document.getElementById("Name").value);
      form.append("phone", document.getElementById("Phone").value);
      form.append("linkedin", document.getElementById("LinkedIn").value);
      form.append("resume", pond.getFile().file);

      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization:
            "Basic 813438d5227b9ea7eb3df82ec03b89a69d5585aa486a6cd52add3bb1081270ebcdd7850721798ac47139770f1d0a910af958cf7e543b2a29c6164c446343f446fca0633d8003239a150f86edd7ca693ba2477c72e725ab5202aafbdedcd4b226c31cdefb9aea7540afbae847a8f0aab6dc6248ff6fe507ebd52bec4fd1dc2c99",
        },
      };

      /* Disable Button On Proses Sending */
      $(".submit-button-apply-job").val("Please Wait...");
      $(".submit-button-apply-job").css("cursor", "not-allowed");
      $(".submit-button-apply-job").attr("disabled", "true");

      options.body = form;

      fetch(
        "https://app.loxo.co/api/wright-talent/jobs/" + jobId + "/apply",
        options
      )
        .then((response) => {
          // Trigger Click on Close Icon
          $(".fs_modal-1_close-2").trigger("click");
          // Trigger Toastify Plugin
          Toastify({
            text: "Your apply successfully sent!",
            duration: 2000,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: {
              background: "#527853",
              fontSize: "15px",
              fontWeight: 400,
              color: "#FFFFFF",
            },
          }).showToast();
          pond.removeFile();
          $("#wf-form-Form-Apply-Job").trigger("reset");

          /* Disable Button On Proses Sending */
          $(".submit-button-apply-job").val("Submit");
          $(".submit-button-apply-job").css("cursor", "pointer");
          $(".submit-button-apply-job").attr("disabled", "false");
        })
        .catch((err) => console.error(err));

      return false;
    });
  });
});

// Filepond Client
const forms = document.querySelectorAll('form[ms-code-file-upload="form"]');

forms.forEach((form) => {
  form.setAttribute("enctype", "multipart/form-data");
  const uploadInputs = form.querySelectorAll("[ms-code-file-upload-input]");

  uploadInputs.forEach((uploadInput) => {
    const inputName = uploadInput.getAttribute("ms-code-file-upload-input");

    const fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("name", inputName);
    fileInput.setAttribute("id", inputName);
    fileInput.setAttribute("required", "");

    uploadInput.appendChild(fileInput);
  });
});

// Copy Url Button
document.getElementById("copy-url").addEventListener("click", function () {
  var currentUrl = window.location.href;
  // Create a temporary input element
  var tempInput = document.createElement("input");
  tempInput.setAttribute("value", currentUrl);
  document.body.appendChild(tempInput);
  // Select the input
  tempInput.select();
  // Copy the selected text
  document.execCommand("copy");
  // Remove the input from the body
  document.body.removeChild(tempInput);

  // Get the tooltip element
  var exampleElement = $(".interaction-copy");
  // Add the class after a delay (e.g., 0 milliseconds for immediate execution)
  setTimeout(function () {
    exampleElement.addClass("active");
  }, 0);
  // Remove the class after 3 seconds
  setTimeout(function () {
    exampleElement.removeClass("active");
  }, 2000);
});

// Skeleton Loading Animation
window.addEventListener("DOMContentLoaded", (event) => {
  const skeletonElements = document.querySelectorAll("[ms-code-skeleton]");

  skeletonElements.forEach((element) => {
    // Create a skeleton div
    const skeletonDiv = document.createElement("div");
    skeletonDiv.classList.add("skeleton-loader");

    // Add the skeleton div to the current element
    element.style.position = "relative";
    element.appendChild(skeletonDiv);
  });
});
