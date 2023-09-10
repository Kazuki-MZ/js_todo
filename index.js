let todos = JSON.parse(localStorage.getItem('todos')) || [];

//チェックボックス作成
const createCheckBox = () => {
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = false;
  checkbox.addEventListener('click', (e) => {
    const checkedItemId = parseInt(e.currentTarget.parentElement.id);
    const checkedItem = todos.find((item) => item.id === checkedItemId);
    const newCheckedItem = {
      ...checkedItem,
      checked: !checkedItem.checked
    };
    updateTodos(newCheckedItem);
  });
  return checkbox;
}

//削除ボタンを作成
const createDeleteButton = () => {
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("deleteButtonStyle");
  deleteButton.textContent = "削除"
  deleteButton.addEventListener("click", (e) => {
    if (window.confirm("本当に削除してもいいですか？")) {
      const deleteItemId = parseInt(e.currentTarget.parentElement.id);
      const remainTodos = todos.filter((item) => item.id !== deleteItemId);
      localStorage.setItem('todos', JSON.stringify(remainTodos));
      location.reload();
    }
  });
  return deleteButton;
};

//編集ボタン
const createEditButton = () => {
  const editButton = document.createElement("button");
  editButton.classList.add("editButtonStyle");
  editButton.textContent = "編集"
  editButton.addEventListener("click", (e) => {
    const editBtn = e.currentTarget;
    const deleteBtn = e.currentTarget.nextElementSibling;
    const text = e.currentTarget.previousElementSibling;
    const itemElement = e.currentTarget.parentElement;
    text.remove();
    editBtn.remove();
    deleteBtn.remove();
    const editItem = todos.find((item) => item.id === parseInt(itemElement.id));
    createEditForm(editItem, itemElement);
  });
  return editButton;
};

//編集フォームと保存ボタン作成
const createEditForm = (editItem, itemElement) => {
  const editFormInput = document.createElement('input');
  editFormInput.classList.add('editFormInputStyle');
  const saveButton = document.createElement("button");
  saveButton.classList.add("saveButtonStyle");
  saveButton.textContent = "保存";
  editFormInput.value = editItem.text;
  itemElement.appendChild(editFormInput);
  itemElement.appendChild(saveButton);

  saveButton.addEventListener("click", () => {
    let editText = editFormInput.value;
    if (!editText) {
      editText = editItem.text;
    }
    const newEditItem = {
      ...editItem,
      text: editText
    };
    updateTodos(newEditItem);
  })
}

//配列更新処理
const updateTodos = (newItem) => {
  const itemIndex = todos.findIndex((item) => item.id === newItem.id);
  todos.splice(itemIndex, 1, newItem);
  localStorage.setItem('todos', JSON.stringify(todos));
  location.reload();
};

//itemElement作成
const createItemElement = (item) => {
  const todoList = document.querySelector('.todoList');
  const li = document.createElement('li');
  li.id = item.id;
  const span = document.createElement('span');
  span.textContent = item.text;
  const setCheckbox = createCheckBox();
  setCheckbox.checked = item.checked;
  const setEditButton = createEditButton();
  const setDeleteButton = createDeleteButton();
  li.appendChild(setCheckbox);
  li.appendChild(span);
  li.appendChild(setEditButton);
  li.appendChild(setDeleteButton);
  todoList.appendChild(li);
};

//ローカルストレージに追加
const saveItem = (text) => {
  const lastItem = todos.slice(-1)[0];
  let newId = 0;
  if (lastItem) {
    newId = lastItem.id + 1;
  }
  const newItem = {
    id: newId,
    text: text,
    checked: false
  };
  todos.push(newItem);
  localStorage.setItem('todos', JSON.stringify(todos));
  return newItem;
};

//フォーム処理
const form = document.querySelector('.todoForm');
const inputItem = document.getElementById('form-input');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = inputItem.value
  if (text) {
    const newItem = saveItem(text);
    createItemElement(newItem);
  } else {
    alert("タスクを入力してください");
  }
  inputItem.value = "";
  location.reload();
});

//Todo一覧を表示
todos.forEach(item => createItemElement(item));

//全てのタスク数表示
const allTodoItem = document.querySelector('.allItem');
allTodoItem.textContent = `全てのタスク:${Object.keys(todos).length}`;

//完了と未完了のタスク数表示
let complete = [];
let incomplete = [];
todos.forEach(item => {
  if (item.checked) {
    complete.push(item);
  } else {
    incomplete.push(item);
  }
});

const completeItem = document.querySelector('.completeItem');
const incompleteItem = document.querySelector('.incompleteItem');
completeItem.textContent = `完了済み:${complete.length}`;
incompleteItem.textContent = `未完了:${incomplete.length}`;