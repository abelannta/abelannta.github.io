window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  "cmsfilter",
  async (filtersInstances) => {
    // Get the filters instance
    const [filtersInstance] = filtersInstances;

    // Get the list instance
    const { listInstance } = filtersInstance;

    // Save a copy the template element
    const [item] = listInstance.items;
    const itemTemplateElement = item.element;

    // Fetch the external data
    const jobs = await fetchJobs();

    // Remove the placeholder items
    listInstance.clearItems();

    // Create the items from the external data
    const newItems = jobs.results.map((job) =>
      createItem(job, "jobData.description", itemTemplateElement)
    );

    listInstance.addItems(newItems);

    console.log(listInstance);
    // Get the radio template element
    const filtersContractTemplateElement = filtersInstance.form.querySelector(
      '[data-element="filter-contract"]'
    );
    if (!filtersContractTemplateElement) return;
    const filtersLocationTemplateElement = filtersInstance.form.querySelector(
      '[data-element="filter-location"]'
    );
    if (!filtersLocationTemplateElement) return;
    // Get the radio template element mobile
    const filtersContractTemplateElementModal =
      filtersInstance.form.querySelector(
        '[data-element="filter-contract-mobile"]'
      );
    if (!filtersContractTemplateElementModal) return;
    const filtersLocationTemplateElementModal =
      filtersInstance.form.querySelector(
        '[data-element="filter-location-mobile"]'
      );
    if (!filtersLocationTemplateElementModal) return;

    // Get the parent element of the radios
    const filtersWrapperElement = filtersContractTemplateElement.parentElement;
    if (!filtersWrapperElement) return;
    const filtersLocationWrapperElement =
      filtersLocationTemplateElement.parentElement;
    if (!filtersLocationWrapperElement) return;
    // Get the parent element of the radios mobile
    const filtersWrapperElementModal =
      filtersContractTemplateElementModal.parentElement;
    if (!filtersWrapperElementModal) return;
    const filtersLocationWrapperElementModal =
      filtersLocationTemplateElementModal.parentElement;
    if (!filtersLocationWrapperElementModal) return;

    // Remove the template radio element
    filtersContractTemplateElement.remove();
    filtersLocationTemplateElement.remove();
    filtersContractTemplateElementModal.remove();
    filtersLocationTemplateElementModal.remove();

    // Collect all the categories of the products
    const jobTypes = collectJobType(jobs.results);
    const cities = collectCity(jobs.results);

    for (const jobtype of jobTypes) {
      const newFilter = createFilter(jobtype, filtersContractTemplateElement);
      const newFilterMobile = createFilter(
        jobtype,
        filtersContractTemplateElementModal
      );
      if (!newFilter) continue;
      if (!newFilterMobile) continue;

      filtersWrapperElement.append(newFilter);
      filtersWrapperElementModal.append(newFilterMobile);
    }

    for (const city of cities) {
      const newFilterLocation = createFilter(
        city,
        filtersLocationTemplateElement
      );
      const newFilterLocationModal = createFilter(
        city,
        filtersLocationTemplateElementModal
      );
      if (!newFilterLocation) continue;
      if (!newFilterLocationModal) continue;

      filtersLocationWrapperElement.append(newFilterLocation);
      filtersLocationWrapperElementModal.append(newFilterLocationModal);
    }

    filtersInstance.storeFiltersData();

    listInstance.on("switchpage", (targetPage) => {});

    // Triger on add items
    listInstance.on("additems", (addedItems) => {
      let fadeUpCards = anime.timeline({
        loop: false,
        autoplay: false,
      });
    });
  },
]);

let fetchJobs = async () => {
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
      "https://app.loxo.co/api/wright-talent/jobs?published_at_sort=desc&status=active&per_page=100",
      options
    );
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
};

let fetchJob = (jobId, element) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization:
        "Basic 813438d5227b9ea7eb3df82ec03b89a69d5585aa486a6cd52add3bb1081270ebcdd7850721798ac47139770f1d0a910af958cf7e543b2a29c6164c446343f446fca0633d8003239a150f86edd7ca693ba2477c72e725ab5202aafbdedcd4b226c31cdefb9aea7540afbae847a8f0aab6dc6248ff6fe507ebd52bec4fd1dc2c99",
    },
  };

  fetch("https://app.loxo.co/api/wright-talent/jobs/" + jobId, options)
    .then((response) => response.json())
    .then((data) => {
      if (element) element.innerHTML = data.description;
    })
    .catch((err) => {
      return err;
    });
};

var createItem = (job, jobDescription, templateElement) => {
  const newItem = templateElement.cloneNode(true);

  const urlLink = newItem.querySelector('[data-element="url-link"]');
  const title = newItem.querySelector('[data-element="title"]');
  const jobType = newItem.querySelector('[data-element="job-type"]');
  const jobCategory = newItem.querySelector('[data-element="job-category"]');
  const salary = newItem.querySelector('[data-element="salary"]');
  const location = newItem.querySelector('[data-element="location"]');
  const publishedAt = newItem.querySelector('[data-element="publishedAt"]');
  const description = newItem.querySelector('[data-element="job-description"]');
  const button = newItem.querySelector("[apply-button]");

  const iconJob = Array.from(
    newItem.querySelectorAll('[data-element="job-icon"]')
  );

  if (urlLink)
    urlLink.href =
      "https://wright-talent.webflow.io/main-job-detail?id=" + job.id;
  if (title) title.textContent = job.title;
  if (jobType) jobType.textContent = job.job_type.name;
  if (jobCategory)
    jobCategory.textContent = job.category.name ? job.category.name : "Others";
  if (salary) salary.textContent = job.salary;
  if (location) location.textContent = job.city;
  if (publishedAt)
    publishedAt.textContent = moment(job.published_at).format("LL");
  if (description) fetchJob(job.id, description);
  if (button) button.setAttribute("apply-button", job.id);
  if (iconJob) {
    iconJob.map((icon) => {
      const removeSkeleton = icon.querySelector(".skeleton-loader");

      if (removeSkeleton) removeSkeleton.remove();
    });
  }

  return newItem;
};

const collectJobType = (products) => {
  const jobTypeCounts = {};

  for (const { job_type } of products) {
    const jobTypeName = job_type.name;

    if (!jobTypeCounts[jobTypeName]) {
      jobTypeCounts[jobTypeName] = 1;
    } else {
      jobTypeCounts[jobTypeName]++;
    }
  }

  const result = Object.keys(jobTypeCounts).map((name) => ({
    name,
    total: jobTypeCounts[name],
  }));

  return result;
};

const collectCity = (jobs) => {
  const cityCounts = {};

  for (const { category } of jobs) {
    const cityName = category.name ? category.name : "Others";

    if (!cityCounts[cityName]) {
      cityCounts[cityName] = 1;
    } else {
      cityCounts[cityName]++;
    }
  }

  const result = Object.keys(cityCounts).map((name) => ({
    name,
    total: cityCounts[name],
  }));

  return result;
};

const collectSalary = (jobs) => {
  const salaries = new Set();

  for (const { salary } of jobs) {
    salaries.add(salary.replaceAll("/year", "").replaceAll("/hour", ""));
  }
  return [...salaries];
};

const createFilter = (value, templateElement) => {
  const newFilter = templateElement.cloneNode(true);

  const label = newFilter.querySelector("span");
  const input = newFilter.querySelector("input");
  const count = newFilter.querySelector("p");
  if (!label || !input) return;

  label.textContent = value.name;
  input.value = value.name;
  input.id = "radio-" + value.name;
  if (count) {
    count.textContent = value.total;
  }

  return newFilter;
};

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

// Apply Job Function
// Open Modal & Apply Job Function
const applyBtns = document.querySelectorAll("button[apply-button]");
const modalWrapper = document.querySelector("#fs-modal-1-popup");
const modalCloseIcon = document.querySelector(".fs_modal-1_close-2");

console.log(applyBtns);

applyBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    jobId = btn.getAttribute("apply-button");
    modalWrapper.classList.add("active");
  });
});

modalCloseIcon.addEventListener("click", () => {
  modalWrapper.classList.remove("active");
});

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
