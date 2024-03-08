// import '../dist/dynamicforms.js'; // Import sources as module
//const {dynamicForms} = require('@simomosi/dynamic-forms');
 import dynamicForms from '@simomosi/dynamic-forms';
import { parse } from 'node-html-parser';
// console.log(dynamicForms);

const formConfiguration = {
  id: "jsonPlaceholder",
  debug: true,
  behavior: {
    beforeUpdate: (subjectName) =>
      (document.getElementById("spinner").style.display = "inline-block"),
    afterUpdate: (subjectName) =>
      (document.getElementById("spinner").style.display = "none"),
    beforeInit: () =>
      (document.getElementById("spinner").style.display = "inline-block"),
    afterInit: () =>
      (document.getElementById("spinner").style.display = "none"),
  },
  fields: [
    {
      name: "user",
      fetch: {
        makeUrl: (data) => `https://jsonplaceholder.typicode.com/users`,
      },
      select: {
        postProcessData: (htmlElement, data) => {
          return data
            .map((x) => {
              return { value: x.id, text: x.username };
            })
            .sort((a, b) => a.text > b.text);
        },
      },
    },
    {
      name: "post",
      fetch: {
        makeUrl: (data) =>
          `https://jsonplaceholder.typicode.com/posts?userId=${data.user}`,
      },
      select: {
        postProcessData: (htmlElement, data) => {
          return data
            .map((x) => {
              return { value: x.id, text: x.title };
            })
            .sort((a, b) => a.text > b.text);
        },
      },
    },
    {
      name: "comment",
      fetch: {
        makeUrl: (data) =>
          `https://jsonplaceholder.typicode.com/comments?postId=${data.post}`,
      },
      select: {
        postProcessData: (htmlElement, data) => {
          return data
            .map((x) => {
              return { value: x.id, text: x.name };
            })
            .sort((a, b) => a.text > b.text);
        },
      },
    },
    {
      name: "album",
      fetch: {
        makeUrl: (data) =>
          `https://jsonplaceholder.typicode.com/albums?userId=${data.user}`,
      },
      select: {
        postProcessData: (htmlElement, data) => {
          return data
            .map((x) => {
              return { value: x.id, text: x.title };
            })
            .sort((a, b) => a.text > b.text);
        },
      },
    },
    {
      name: "photo",
      fetch: {
        makeUrl: (data) =>
          `https://jsonplaceholder.typicode.com/photos?albumId=${data.album}`,
      },
      select: {
        postProcessData: (htmlElement, data) => {
          return data
            .map((x) => {
              return { value: x.id, text: x.url };
            })
            .sort((a, b) => a.text > b.text);
        },
      },
    },
    {
      name: "todo",
      fetch: {
        makeUrl: (data) =>
          `https://jsonplaceholder.typicode.com/todos?userId=${data.user}`,
      },
      select: {
        postProcessData: (htmlElement, data) => {
          return data
            .map((x) => {
              return { value: x.id, text: x.title };
            })
            .sort((a, b) => a.text > b.text);
        },
      },
    },
    {
      name: "checkbox-target-field",
      behavior: {
        updateStatus: (htmlElement, data, subjectName) => {
          let value = data[subjectName];
          switch (subjectName) {
            case "visibility-checkbox":
              if (value === true) {
                htmlElement.style.display = "block";
              } else {
                htmlElement.style.display = "none";
              }
              break;
            case "readonly-checkbox":
              htmlElement.readOnly = value;
              break;
          }
        },
      },
    },
    {
      name: "radio-target-textarea",
      behavior: {
        updateStatus: (htmlElement, data, subjectName) => {
          let value = parseInt(data[subjectName]);
          htmlElement.rows = value;
        },
      },
    },
  ],
  rules: [
    {
      name: "user",
      update: ["post", "album", "todo"],
    },
    {
      name: "post",
      update: ["comment"],
      additionalData: ["user"],
      externalData: (data, subjectName) => {
        return { timestamp: new Date() };
      },
    },
    {
      name: "album",
      update: ["photo"],
    },
    {
      name: "visibility-checkbox",
      update: ["checkbox-target-field"],
      additionalData: ["readonly-checkbox"],
    },
    {
      name: "readonly-checkbox",
      update: ["checkbox-target-field"],
      additionalData: ["visibility-checkbox"],
    },
    {
      name: "rows-radio",
      update: ["radio-target-textarea"],
    },
  ],
  init: [
    {
      name: "user",
      value: "1",
    },
    {
      name: "post",
      value: "2",
    },
    {
      name: "timestamp",
      value: new Date(),
    },
    {
      name: "isInit",
      value: true,
    },
  ],
};

// Init
let start = new Date();

let form = dynamicForms.makeForm(formConfiguration);
form.ready().then(() => {
  let end = new Date();
  console.log(
    "Benchmark init time:",
    end.getMilliseconds() - start.getMilliseconds(),
    "ms"
  );
});

// Enable/Disable form
function enableDisableForm() {
  let value = document.querySelectorAll("input[name=formEnabled]:checked")[0]
    .value;
  if (value === "ON") {
    form.setEnabled(true);
  } else {
    form.setEnabled(false);
  }
}

document
  .getElementsByName("formEnabled")
  .forEach((item) => item.addEventListener("click", enableDisableForm));
enableDisableForm();
