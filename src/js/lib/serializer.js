'use strict';

/**
 * @exports serializer
 */
const serializer = {
  serialize (form) {
    const { elements } = form;
    const { length } = elements;
    const data = { };

    data.arrayfields = { };
    data.checkboxes = { };
    data.input = { };
    data.select = { };

    for (let i = 0; i < length; i++) {
      const node = elements[i];

      // checkboxes
      if (node.type === 'checkbox') {
        if (serializer.isPolicyEnabled(node) && node.checked) {
          data.checkboxes[node.id] = true;
        }
      }
      // select fields
      else if (node.type === 'select-one') {
        if (serializer.isPolicyEnabled(node)) {
          data.select[node.id] = node.value;
        }
      }
      // text fields
      else if (node.type === 'text') {
        if (serializer.isPolicyEnabled(node) && node.value) {
          data.input[node.id] = node.value;
        }
      }
    }

    return data;
  },

  unserialize (data) {
    // checkboxes
    Object.keys(data.checkboxes).forEach((id) => {
      document.getElementById(id).checked = true;
    });

    // select fields
    Object.keys(data.select).forEach((id) => {
      document.querySelector('#' + id + ' [value="' + data.select[id] + '"]').selected = true;
    });

    // text fields
    Object.keys(data.input).forEach((id) => {
      const el = document.getElementById(id);

      if (el) {
        el.value = data.input[id];

        // remove validation hint, because it's guaranteed by the serializer that the element has a value
        if (el.hasAttribute('data-mandatory')) {
          el.classList.remove('mandatory-style');
          el.parentNode.querySelector('.mandatory-label').classList.add('hidden');
        }
      }
    });
  },

  isPolicyEnabled (el) {
    return el.closest('.checkbox').querySelector(':scope > .primary-checkbox').checked;
  }
};
