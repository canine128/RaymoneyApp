const STORAGE_KEY = "ray_money_book_records_v1";
const DEBT_STORAGE_KEY = "ray_money_book_debts_v1";
const FOLDER_CATEGORY_STORAGE_KEY = "ray_money_book_folder_categories_v1";
const ACCOUNT_STORAGE_KEY = "ray_money_book_accounts_v1";


const defaultFolderCategories = {
  expense: {
    "餐飲": ["早餐", "午餐", "晚餐", "飲料"],
    "交通": ["油錢", "停車費", "捷運", "高鐵"],
    "房租": [],
    "生活用品": [],
    "購物": [],
    "娛樂": [],
    "貸款": ["車貸", "信貸"],
    "信用卡": ["中國信託", "凱基", "玉山"],
    "信用卡支出": [],
    "寵物": ["飼料", "醫療", "用品"],
    "醫療": [],
    "其他": []
  },
  income: {
    "薪水": [],
    "獎金": [],
    "兼職": [],
    "投資": [],
    "退款": [],
    "其他": []
  }
};

const defaultAccounts = [
  { id: "cash_wallet", name: "現金錢包", type: "cash", initialBalance: 0, createdAt: "default" },
  { id: "bank_account", name: "銀行帳戶", type: "bank", initialBalance: 0, createdAt: "default" },
  { id: "saving_jar", name: "存錢筒", type: "saving", initialBalance: 0, createdAt: "default" }
];

const accountTypeLabels = {
  cash: "現金",
  bank: "銀行",
  saving: "存錢",
  other: "其他"
};

const accountTypeOrder = ["cash", "bank", "saving", "other"];

const chartColors = [
  "#c79b55",
  "#a97838",
  "#d8b97a",
  "#c96f55",
  "#9f7b63",
  "#6f8f7a",
  "#8c6f9f",
  "#d29573",
  "#7897a8",
  "#b7a07a",
  "#d0a4a4",
  "#a8a17a"
];

let records = loadRecords();
let debts = loadDebts();
let accounts = loadAccounts();
let folderCategories = loadFolderCategories();
let menuParentCategory = "";
let editingRecordId = null;
let editingAccountId = null;


const recordForm = document.getElementById("recordForm");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const subCategoryInput = document.getElementById("subCategory");
const categoryButton = document.getElementById("categoryButton");
const categoryButtonText = document.getElementById("categoryButtonText");
const accountSelect = document.getElementById("accountSelect");
const accountSelectButton = document.getElementById("accountSelectButton");
const accountSelectButtonText = document.getElementById("accountSelectButtonText");
const recordSubmitBtn = recordForm ? recordForm.querySelector(".primary-btn") : null;
const recordFormTitle = document.querySelector(".form-card h2");
let cancelEditRecordBtn = null;

const menuOverlay = document.getElementById("menuOverlay");
const menuTitle = document.getElementById("menuTitle");
const menuSubtitle = document.getElementById("menuSubtitle");
const menuList = document.getElementById("menuList");
const menuBackBtn = document.getElementById("menuBackBtn");
const menuCloseBtn = document.getElementById("menuCloseBtn");
const addSubCategoryBox = document.getElementById("addSubCategoryBox");
const newSubCategoryInput = document.getElementById("newSubCategoryInput");
const saveSubCategoryBtn = document.getElementById("saveSubCategoryBtn");

const dateInput = document.getElementById("date");
const noteInput = document.getElementById("note");
const monthFilter = document.getElementById("monthFilter");

const balanceAmount = document.getElementById("balanceAmount");
const incomeAmount = document.getElementById("incomeAmount");
const expenseAmount = document.getElementById("expenseAmount");
const topCategory = document.getElementById("topCategory");
const recordList = document.getElementById("recordList");
const categoryChart = document.getElementById("categoryChart");
const chartCenterText = document.getElementById("chartCenterText");
const chartLegend = document.getElementById("chartLegend");
const statsMonthFilter = document.getElementById("statsMonthFilter");
const statsBalanceAmount = document.getElementById("statsBalanceAmount");
const statsIncomeAmount = document.getElementById("statsIncomeAmount");
const statsExpenseAmount = document.getElementById("statsExpenseAmount");
const statsTopCategory = document.getElementById("statsTopCategory");
const statsStatus = document.getElementById("statsStatus");
const expenseRate = document.getElementById("expenseRate");
const expenseRateBar = document.getElementById("expenseRateBar");
const statsInsightText = document.getElementById("statsInsightText");
const categoryRankList = document.getElementById("categoryRankList");
const assetTotalBalance = document.getElementById("assetTotalBalance");
const assetTotalIncome = document.getElementById("assetTotalIncome");
const assetTotalExpense = document.getElementById("assetTotalExpense");
const assetMonthBalance = document.getElementById("assetMonthBalance");
const assetBalanceHint = document.getElementById("assetBalanceHint");
const savingRate = document.getElementById("savingRate");
const savingRateBar = document.getElementById("savingRateBar");
const assetInsightText = document.getElementById("assetInsightText");
const liabilityRemainingTotal = document.getElementById("liabilityRemainingTotal");
const liabilityPaidTotal = document.getElementById("liabilityPaidTotal");
const liabilityProgressText = document.getElementById("liabilityProgressText");
const liabilityItemCount = document.getElementById("liabilityItemCount");
const liabilityOverallPercent = document.getElementById("liabilityOverallPercent");
const liabilityOverallBar = document.getElementById("liabilityOverallBar");
const liabilityOverallHint = document.getElementById("liabilityOverallHint");
const statsDebtProgressList = document.getElementById("statsDebtProgressList");

const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");
const clearMonthBtn = document.getElementById("clearMonthBtn");

const accountPanelToggle = document.getElementById("accountPanelToggle");
const accountPanelBody = document.getElementById("accountPanelBody");
const accountList = document.getElementById("accountList");
const openAccountFormBtn = document.getElementById("openAccountFormBtn");
const accountForm = document.getElementById("accountForm");
const recordAccountField = document.getElementById("recordAccountField");
const accountFieldHint = document.getElementById("accountFieldHint");
const recordMoreOptions = document.getElementById("recordMoreOptions");
const accountNameInput = document.getElementById("accountNameInput");
const accountTypeSelect = document.getElementById("accountTypeSelect");
const accountTypeButton = document.getElementById("accountTypeButton");
const accountTypeButtonText = document.getElementById("accountTypeButtonText");
const accountInitialInput = document.getElementById("accountInitialInput");
const saveAccountBtn = document.getElementById("saveAccountBtn");
const cancelAccountEditBtn = document.getElementById("cancelAccountEditBtn");

const tabButtons = document.querySelectorAll(".tab-button");
const tabPages = document.querySelectorAll(".tab-page");


const debtType = document.getElementById("debtType");
const debtName = document.getElementById("debtName");
const creditCardFields = document.getElementById("creditCardFields");
const loanFormulaFields = document.getElementById("loanFormulaFields");
const revolvingFields = document.getElementById("revolvingFields");
const creditAmount = document.getElementById("creditAmount");
const creditInstallments = document.getElementById("creditInstallments");
const creditPaidPeriods = document.getElementById("creditPaidPeriods");
const creditPreview = document.getElementById("creditPreview");
const loanPrincipal = document.getElementById("loanPrincipal");
const loanAnnualRate = document.getElementById("loanAnnualRate");
const loanMonthlyPayment = document.getElementById("loanMonthlyPayment");
const loanPaidPeriods = document.getElementById("loanPaidPeriods");
const loanPreview = document.getElementById("loanPreview");
const revolvingPrincipal = document.getElementById("revolvingPrincipal");
const revolvingAnnualRate = document.getElementById("revolvingAnnualRate");
const revolvingInterestDays = document.getElementById("revolvingInterestDays");
const revolvingPayment = document.getElementById("revolvingPayment");
const revolvingLinkedSubCategory = document.getElementById("revolvingLinkedSubCategory");
const revolvingPreview = document.getElementById("revolvingPreview");
const addDebtBtn = document.getElementById("addDebtBtn");
const debtMonthlyTotal = document.getElementById("debtMonthlyTotal");
const debtCount = document.getElementById("debtCount");
const debtList = document.getElementById("debtList");
const creditDetailMonthFilter = document.getElementById("creditDetailMonthFilter");
const creditDetailTotal = document.getElementById("creditDetailTotal");
const creditDetailCount = document.getElementById("creditDetailCount");
const creditCardDetailList = document.getElementById("creditCardDetailList");
const openDebtModalBtn = document.getElementById("openDebtModalBtn");
const debtModal = document.getElementById("debtModal");
const debtModalClose = document.getElementById("debtModalClose");
const debtModalCancel = document.getElementById("debtModalCancel");
const appDialog = document.getElementById("appDialog");
const appDialogTitle = document.getElementById("appDialogTitle");
const appDialogMessage = document.getElementById("appDialogMessage");
const appDialogActions = document.getElementById("appDialogActions");
const appDialogCancel = document.getElementById("appDialogCancel");
const appDialogConfirm = document.getElementById("appDialogConfirm");
const customSelectOverlay = document.getElementById("customSelectOverlay");
const customSelectTitle = document.getElementById("customSelectTitle");
const customSelectSubtitle = document.getElementById("customSelectSubtitle");
const customSelectList = document.getElementById("customSelectList");
const customSelectClose = document.getElementById("customSelectClose");
const monthPickerOverlay = document.getElementById("monthPickerOverlay");
const monthPickerGrid = document.getElementById("monthPickerGrid");
const monthPickerYearLabel = document.getElementById("monthPickerYearLabel");
const monthPrevYear = document.getElementById("monthPrevYear");
const monthNextYear = document.getElementById("monthNextYear");
const monthPickerCancel = document.getElementById("monthPickerCancel");
const datePickerOverlay = document.getElementById("datePickerOverlay");
const datePickerGrid = document.getElementById("datePickerGrid");
const datePickerMonthLabel = document.getElementById("datePickerMonthLabel");
const datePickerSummary = document.getElementById("datePickerSummary");
const datePrevMonth = document.getElementById("datePrevMonth");
const dateNextMonth = document.getElementById("dateNextMonth");
const datePickerCancel = document.getElementById("datePickerCancel");
const datePickerToday = document.getElementById("datePickerToday");
let activeCustomSelectHandler = null;


init();


function showAppDialog({ title = "提示", message = "", mode = "alert" }) {
  return new Promise((resolve) => {
    if (!appDialog) {
      resolve(mode === "confirm" ? false : true);
      return;
    }

    appDialogTitle.textContent = title;
    appDialogMessage.textContent = message;

    if (mode === "alert") {
      appDialogCancel.hidden = true;
      appDialogConfirm.textContent = "知道了";
    } else {
      appDialogCancel.hidden = false;
      appDialogConfirm.textContent = "確定";
    }

    appDialog.hidden = false;
    document.body.classList.add("app-dialog-open");

    const cleanup = () => {
      appDialogConfirm.onclick = null;
      appDialogCancel.onclick = null;
    };

    appDialogConfirm.onclick = () => {
      cleanup();
      hideAppDialog();
      resolve(true);
    };

    appDialogCancel.onclick = () => {
      cleanup();
      hideAppDialog();
      resolve(false);
    };
  });
}


function customPrompt(message, title = "輸入金額", defaultValue = "") {
  return new Promise((resolve) => {
    if (!appDialog) {
      resolve(window.prompt(message, defaultValue));
      return;
    }

    appDialogTitle.textContent = title;
    appDialogMessage.innerHTML = "";

    const promptText = document.createElement("p");
    promptText.textContent = message;

    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.inputMode = "decimal";
    input.value = defaultValue;
    input.className = "app-dialog-input";
    input.placeholder = "例如：9000";

    appDialogMessage.appendChild(promptText);
    appDialogMessage.appendChild(input);

    appDialogCancel.hidden = false;
    appDialogConfirm.textContent = "確認";

    appDialog.hidden = false;
    document.body.classList.add("app-dialog-open");

    setTimeout(() => input.focus(), 60);

    const cleanup = () => {
      appDialogConfirm.onclick = null;
      appDialogCancel.onclick = null;
      input.onkeydown = null;
    };

    appDialogConfirm.onclick = () => {
      const value = input.value.trim();
      cleanup();
      hideAppDialog();
      resolve(value);
    };

    appDialogCancel.onclick = () => {
      cleanup();
      hideAppDialog();
      resolve(null);
    };

    input.onkeydown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        appDialogConfirm.click();
      }
    };
  });
}

function hideAppDialog() {
  if (!appDialog) return;
  appDialog.hidden = true;
  document.body.classList.remove("app-dialog-open");
}

function customAlert(message, title = "提示") {
  return showAppDialog({ title, message, mode: "alert" });
}

function customConfirm(message, title = "提示") {
  return showAppDialog({ title, message, mode: "confirm" });
}


function formatMonthLabel(rawMonth) {
  if (!rawMonth) return "";
  const [year, month] = String(rawMonth).split("-");
  return `${year}年${month}月`;
}

function setMonthInputValue(input, rawMonth) {
  if (!input) return;
  input.dataset.month = rawMonth;
  input.value = formatMonthLabel(rawMonth);
}

function getSelectedMonthValue() {
  return monthFilter?.dataset?.month || formatMonth(new Date());
}

let activeMonthPickerTarget = null;
let monthPickerYear = new Date().getFullYear();
let monthPickerMonth = new Date().getMonth() + 1;

function renderMonthPickerGrid() {
  if (!monthPickerGrid || !monthPickerYearLabel) return;
  monthPickerYearLabel.textContent = `${monthPickerYear} 年`;
  const rawSelected = `${monthPickerYear}-${String(monthPickerMonth).padStart(2, "0")}`;

  monthPickerGrid.innerHTML = Array.from({ length: 12 }, (_, index) => {
    const monthNumber = index + 1;
    const raw = `${monthPickerYear}-${String(monthNumber).padStart(2, "0")}`;
    const isActive = raw === rawSelected;
    return `
      <button
        type="button"
        class="month-chip ${isActive ? "active" : ""}"
        data-month="${raw}"
      >
        ${String(monthNumber).padStart(2, "0")} 月
      </button>
    `;
  }).join("");

  monthPickerGrid.querySelectorAll(".month-chip").forEach((button) => {
    button.addEventListener("click", () => {
      const raw = button.dataset.month;
      applySelectedMonth(raw);
      closeMonthPicker();
    });
  });
}

function openMonthPicker(targetInput) {
  activeMonthPickerTarget = targetInput;
  const raw = targetInput?.dataset?.month || formatMonth(new Date());
  const [year, month] = raw.split("-").map(Number);
  monthPickerYear = year;
  monthPickerMonth = month;
  renderMonthPickerGrid();
  if (monthPickerOverlay) monthPickerOverlay.hidden = false;
  document.body.classList.add("app-dialog-open");
}

function closeMonthPicker() {
  if (monthPickerOverlay) monthPickerOverlay.hidden = true;
  document.body.classList.remove("app-dialog-open");
  activeMonthPickerTarget = null;
}

function applySelectedMonth(rawMonth) {
  setMonthInputValue(monthFilter, rawMonth);
  if (statsMonthFilter) setMonthInputValue(statsMonthFilter, rawMonth);
  if (creditDetailMonthFilter) setMonthInputValue(creditDetailMonthFilter, rawMonth);
  render();
}


let datePickerCursor = new Date();
let datePickerSelected = null;

function renderDatePickerGrid() {
  if (!datePickerGrid || !datePickerMonthLabel) return;
  const viewYear = datePickerCursor.getFullYear();
  const viewMonth = datePickerCursor.getMonth();
  datePickerMonthLabel.textContent = `${viewYear} 年 ${String(viewMonth + 1).padStart(2, "0")} 月`;
  if (datePickerSummary && datePickerSelected) {
    datePickerSummary.textContent = formatFullDateLabel(datePickerSelected);
  }

  const firstDay = new Date(viewYear, viewMonth, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
  const todayRaw = formatDate(new Date());
  const selectedRaw = datePickerSelected ? formatDate(datePickerSelected) : "";

  const cells = [];
  for (let i = 0; i < 42; i += 1) {
    let cellDate;
    let otherMonth = false;
    if (i < startWeekday) {
      cellDate = new Date(viewYear, viewMonth - 1, prevMonthDays - startWeekday + i + 1);
      otherMonth = true;
    } else if (i >= startWeekday + daysInMonth) {
      cellDate = new Date(viewYear, viewMonth + 1, i - startWeekday - daysInMonth + 1);
      otherMonth = true;
    } else {
      cellDate = new Date(viewYear, viewMonth, i - startWeekday + 1);
    }
    const raw = formatDate(cellDate);
    const classes = ['date-day'];
    if (otherMonth) classes.push('other-month');
    if (raw === todayRaw) classes.push('today');
    if (raw === selectedRaw) classes.push('active');
    cells.push(`<button type="button" class="${classes.join(' ')}" data-date="${raw}">${cellDate.getDate()}</button>`);
  }
  datePickerGrid.innerHTML = cells.join('');
  datePickerGrid.querySelectorAll('.date-day').forEach((button) => {
    button.addEventListener('click', () => {
      const raw = button.dataset.date;
      datePickerSelected = new Date(`${raw}T00:00:00`);
      setDateInputValue(raw);
      closeDatePicker();
    });
  });
}

function openDatePicker() {
  const raw = getDateInputValue() || formatDate(new Date());
  datePickerSelected = new Date(`${raw}T00:00:00`);
  datePickerCursor = new Date(datePickerSelected.getFullYear(), datePickerSelected.getMonth(), 1);
  renderDatePickerGrid();
  if (datePickerOverlay) datePickerOverlay.hidden = false;
  document.body.classList.add('app-dialog-open');
}

function closeDatePicker() {
  if (datePickerOverlay) datePickerOverlay.hidden = true;
  document.body.classList.remove('app-dialog-open');
}

function init() {
  menuBackBtn.style.visibility = "hidden";

  const today = new Date();
  setDateInputValue(formatDate(today));
  setMonthInputValue(monthFilter, formatMonth(today));
  if (statsMonthFilter) {
    setMonthInputValue(statsMonthFilter, monthFilter.dataset.month);
  }
  if (creditDetailMonthFilter) {
    setMonthInputValue(creditDetailMonthFilter, monthFilter.dataset.month);
  }

  document.querySelectorAll("input[name='type']").forEach((radio) => {
    radio.addEventListener("change", () => {
      clearSelectedCategory();
      updateRecordAccountFieldState();
    });
  });

  categoryButton.addEventListener("click", openCategoryMenu);
  menuCloseBtn.addEventListener("click", closeMenu);
  menuBackBtn.addEventListener("click", renderMainCategoryMenu);

  menuOverlay.addEventListener("click", (event) => {
    if (event.target === menuOverlay) {
      closeMenu();
    }
  });

  saveSubCategoryBtn.addEventListener("click", saveCategoryFromBox);
  newSubCategoryInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveCategoryFromBox();
    }
  });

  recordForm.addEventListener("submit", addRecord);
  setupRecordEditControls();
  setupAccountControls();
  monthFilter.addEventListener("click", () => openMonthPicker(monthFilter));
  if (statsMonthFilter) {
    statsMonthFilter.addEventListener("click", () => openMonthPicker(statsMonthFilter));
  }
  if (creditDetailMonthFilter) {
    creditDetailMonthFilter.addEventListener("click", () => openMonthPicker(creditDetailMonthFilter));
  }

  if (monthPrevYear) {
    monthPrevYear.addEventListener("click", () => {
      monthPickerYear -= 1;
      renderMonthPickerGrid();
    });
  }

  if (monthNextYear) {
    monthNextYear.addEventListener("click", () => {
      monthPickerYear += 1;
      renderMonthPickerGrid();
    });
  }

  if (monthPickerCancel) {
    monthPickerCancel.addEventListener("click", closeMonthPicker);
  }

  if (monthPickerOverlay) {
    monthPickerOverlay.addEventListener("click", (event) => {
      if (event.target === monthPickerOverlay) closeMonthPicker();
    });
  }

  if (dateInput) {
    dateInput.addEventListener("click", openDatePicker);
  }
  if (datePrevMonth) {
    datePrevMonth.addEventListener("click", () => {
      datePickerCursor = new Date(datePickerCursor.getFullYear(), datePickerCursor.getMonth() - 1, 1);
      renderDatePickerGrid();
    });
  }
  if (dateNextMonth) {
    dateNextMonth.addEventListener("click", () => {
      datePickerCursor = new Date(datePickerCursor.getFullYear(), datePickerCursor.getMonth() + 1, 1);
      renderDatePickerGrid();
    });
  }
  if (datePickerCancel) {
    datePickerCancel.addEventListener("click", closeDatePicker);
  }
  if (datePickerToday) {
    datePickerToday.addEventListener("click", () => {
      const now = new Date();
      datePickerSelected = now;
      datePickerCursor = new Date(now.getFullYear(), now.getMonth(), 1);
      setDateInputValue(formatDate(now));
      closeDatePicker();
    });
  }
  if (datePickerOverlay) {
    datePickerOverlay.addEventListener("click", (event) => {
      if (event.target === datePickerOverlay) closeDatePicker();
    });
  }
  exportBtn.addEventListener("click", exportBackup);
  importBtn.addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", importBackup);
  clearMonthBtn.addEventListener("click", clearCurrentMonth);


  if (debtType) {
    debtType.addEventListener("change", updateDebtTypeFields);
  }

  [creditAmount, creditInstallments, creditPaidPeriods].forEach((input) => {
    if (input) input.addEventListener("input", updateDebtPreviews);
  });

  [loanPrincipal, loanAnnualRate, loanMonthlyPayment, loanPaidPeriods].forEach((input) => {
    if (input) input.addEventListener("input", updateDebtPreviews);
  });

  [revolvingPrincipal, revolvingAnnualRate, revolvingInterestDays, revolvingPayment, revolvingLinkedSubCategory].forEach((input) => {
    if (input) input.addEventListener("input", updateDebtPreviews);
  });

  if (addDebtBtn) {
    addDebtBtn.addEventListener("click", addDebtItem);
  }

  if (openDebtModalBtn) {
    openDebtModalBtn.addEventListener("click", openDebtModal);
  }

  if (debtModalClose) {
    debtModalClose.addEventListener("click", closeDebtModal);
  }

  if (debtModalCancel) {
    debtModalCancel.addEventListener("click", closeDebtModal);
  }

  if (debtModal) {
    debtModal.addEventListener("click", (event) => {
      if (event.target === debtModal) {
        closeDebtModal();
      }
    });
  }

  if (appDialog) {
    appDialog.addEventListener("click", (event) => {
      if (event.target === appDialog) {
        hideAppDialog();
      }
    });
  }

  updateDebtTypeFields();
  updateRecordAccountFieldState();


  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      switchTab(button.dataset.tab);
    });
  });

  switchTab("book");

  render();
}

function addRecord(event) {
  event.preventDefault();

  const amount = Number(amountInput.value);
  const type = getSelectedType();
  const category = categoryInput.value;
  const subCategory = subCategoryInput.value;
  const isCreditCardExpense = isCreditCardExpenseValues(type, category, subCategory);
  const accountId = isCreditCardExpense ? "" : getSelectedAccountId();
  const date = getDateInputValue();
  const note = noteInput.value.trim();

  if (!amount || amount <= 0) {
    customAlert("請輸入正確的金額");
    return;
  }

  if (!category) {
    customAlert("請選擇分類");
    return;
  }

  if (!isCreditCardExpense && !accountId) {
    customAlert("請選擇帳戶");
    return;
  }

  if (!date) {
    customAlert("請選擇日期");
    return;
  }

  if (editingRecordId) {
    const targetIndex = records.findIndex((record) => record.id === editingRecordId);

    if (targetIndex === -1) {
      customAlert("找不到要修改的紀錄，請重新選擇一次。", "修改失敗");
      resetRecordEditMode();
      return;
    }

    records[targetIndex] = {
      ...records[targetIndex],
      type,
      amount,
      category,
      subCategory,
      accountId,
      date,
      note,
      updatedAt: new Date().toISOString()
    };

    saveRecords();
    resetRecordFormAfterSubmit();
    resetRecordEditMode();
    render();
    customAlert("這筆紀錄已更新完成", "修改完成");
    return;
  }

  const newRecord = {
    id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    type,
    amount,
    category,
    subCategory,
    accountId,
    date,
    note,
    createdAt: new Date().toISOString()
  };

  records.push(newRecord);
  saveRecords();

  resetRecordFormAfterSubmit();


  if (debtType) {
    debtType.addEventListener("change", updateDebtTypeFields);
  }

  [creditAmount, creditInstallments, creditPaidPeriods].forEach((input) => {
    if (input) input.addEventListener("input", updateDebtPreviews);
  });

  [loanPrincipal, loanAnnualRate, loanMonthlyPayment, loanPaidPeriods].forEach((input) => {
    if (input) input.addEventListener("input", updateDebtPreviews);
  });

  if (addDebtBtn) {
    addDebtBtn.addEventListener("click", addDebtItem);
  }

  updateDebtTypeFields();

  render();
}

function setupRecordEditControls() {
  if (!recordForm || !recordSubmitBtn) return;

  cancelEditRecordBtn = document.createElement("button");
  cancelEditRecordBtn.type = "button";
  cancelEditRecordBtn.className = "secondary-record-btn";
  cancelEditRecordBtn.textContent = "取消修改";
  cancelEditRecordBtn.hidden = true;
  cancelEditRecordBtn.addEventListener("click", () => {
    resetRecordFormAfterSubmit();
    resetRecordEditMode();
  });

  recordSubmitBtn.insertAdjacentElement("afterend", cancelEditRecordBtn);
  resetRecordEditMode();
}

function resetRecordFormAfterSubmit() {
  amountInput.value = "";
  noteInput.value = "";
  setDateInputValue(formatDate(new Date()));
  setSelectedAccount(getDefaultAccountId());
  if (recordMoreOptions) recordMoreOptions.open = false;
  updateRecordAccountFieldState();
}

function resetRecordEditMode() {
  editingRecordId = null;
  if (recordSubmitBtn) recordSubmitBtn.textContent = "新增記錄";
  if (recordFormTitle) recordFormTitle.textContent = "新增一筆";
  if (cancelEditRecordBtn) cancelEditRecordBtn.hidden = true;
}

function setSelectedType(type) {
  const radio = document.querySelector(`input[name='type'][value='${type}']`);
  if (radio) radio.checked = true;
  updateRecordAccountFieldState();
}

function editRecord(id) {
  const record = records.find((item) => item.id === id);

  if (!record) {
    customAlert("找不到這筆紀錄，可能已經被刪除了。", "無法編輯");
    return;
  }

  editingRecordId = id;
  setSelectedType(record.type || "expense");
  amountInput.value = record.amount || "";
  categoryInput.value = record.category || "";
  subCategoryInput.value = record.subCategory || "";
  setSelectedAccount(getRecordAccountId(record));
  setDateInputValue(record.date || formatDate(new Date()));
  noteInput.value = record.note || "";
  updateCategoryButtonText();
  updateRecordAccountFieldState();
  if (recordMoreOptions) recordMoreOptions.open = Boolean(record.note) || Boolean(record.date);

  if (recordSubmitBtn) recordSubmitBtn.textContent = "儲存修改";
  if (recordFormTitle) recordFormTitle.textContent = "修改紀錄";
  if (cancelEditRecordBtn) cancelEditRecordBtn.hidden = false;

  recordForm.scrollIntoView({ behavior: "smooth", block: "start" });
  amountInput.focus({ preventScroll: true });
}

function openCategoryMenu() {
  menuOverlay.hidden = false;
  document.body.classList.add("menu-open");
  renderMainCategoryMenu();
}

function closeMenu() {
  menuOverlay.hidden = true;
  document.body.classList.remove("menu-open");
  addSubCategoryBox.hidden = true;
  newSubCategoryInput.value = "";
  menuParentCategory = "";
}



function closeAllSwipeRows(exceptRow = null) {
  menuList.querySelectorAll(".swipe-row.swiped").forEach((row) => {
    if (row !== exceptRow) {
      row.classList.remove("swiped");
    }
  });
}

function attachSwipeDeleteRows() {
  menuList.querySelectorAll(".swipe-row").forEach((row) => {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let tracking = false;

    row.addEventListener("touchstart", (event) => {
      if (event.touches.length !== 1) return;

      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      currentX = startX;
      tracking = true;
      row.classList.remove("dragging");
    }, { passive: true });

    row.addEventListener("touchmove", (event) => {
      if (!tracking || event.touches.length !== 1) return;

      currentX = event.touches[0].clientX;
      const currentY = event.touches[0].clientY;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 12) {
        row.classList.add("dragging");
      }
    }, { passive: true });

    row.addEventListener("touchend", () => {
      if (!tracking) return;

      const deltaX = currentX - startX;

      if (deltaX < -38) {
        closeAllSwipeRows(row);
        row.classList.add("swiped");
      } else if (deltaX > 24 || Math.abs(deltaX) < 10) {
        row.classList.remove("swiped");
      }

      row.classList.remove("dragging");
      tracking = false;
    });
  });
}

function updateCategoryAddBox(mode) {
  addSubCategoryBox.hidden = false;
  newSubCategoryInput.value = "";

  if (mode === "main") {
    newSubCategoryInput.placeholder = "輸入新的大分類，例如：保養、學習";
    saveSubCategoryBtn.textContent = "新增大分類";
  } else {
    newSubCategoryInput.placeholder = `輸入新的小分類，例如：${menuParentCategory === "貸款" ? "車貸" : "子分類"}`;
    saveSubCategoryBtn.textContent = "新增小分類";
  }
}

function saveCategoryFromBox() {
  if (menuParentCategory) {
    saveNewSubCategory();
  } else {
    saveNewMainCategory();
  }
}

function saveNewMainCategory() {
  const type = getSelectedType();
  const newName = newSubCategoryInput.value.trim();

  if (!newName) {
    customAlert("請輸入大分類名稱");
    return;
  }

  if (!folderCategories[type]) {
    folderCategories[type] = {};
  }

  if (!folderCategories[type][newName]) {
    folderCategories[type][newName] = [];
    const sorted = Object.keys(folderCategories[type])
      .sort((a, b) => a.localeCompare(b, "zh-Hant"))
      .reduce((acc, key) => {
        acc[key] = folderCategories[type][key];
        return acc;
      }, {});
    folderCategories[type] = sorted;
    saveFolderCategories();
  }

  newSubCategoryInput.value = "";
  renderMainCategoryMenu();
}

async function deleteMainCategory(type, category) {
  const confirmed = await customConfirm(`確定要刪除大分類「${category}」嗎？
底下的小分類也會一起刪除，但已經記帳的資料不會被刪掉。`, "刪除大分類");
  if (!confirmed) return;

  if (folderCategories[type] && folderCategories[type][category] !== undefined) {
    delete folderCategories[type][category];
  }

  if (categoryInput.value === category) {
    clearSelectedCategory();
  }

  if (menuParentCategory === category) {
    menuParentCategory = "";
  }

  saveFolderCategories();
  renderMainCategoryMenu();
}

async function deleteSubCategory(type, category, subCategory) {
  const confirmed = await customConfirm(`確定要刪除小分類「${subCategory}」嗎？
已經記帳的資料不會被刪掉。`, "刪除小分類");
  if (!confirmed) return;

  const list = folderCategories[type][category] || [];
  folderCategories[type][category] = list.filter((item) => item !== subCategory);

  if (categoryInput.value === category && subCategoryInput.value === subCategory) {
    subCategoryInput.value = "";
    updateCategoryButtonText();
  }

  saveFolderCategories();
  renderSubCategoryMenu(category);
}

function renderMainCategoryMenu() {
  const type = getSelectedType();
  const categories = Object.keys(folderCategories[type] || {}).sort((a, b) => a.localeCompare(b, "zh-Hant"));

  menuParentCategory = "";
  menuBackBtn.style.visibility = "hidden";
  menuTitle.textContent = "選擇大分類";
  menuSubtitle.textContent = "點一個大分類，再進入小分類；左滑可刪除";
  updateCategoryAddBox("main");

  menuList.innerHTML = categories
    .map((category) => {
      const subCount = (folderCategories[type][category] || []).length;
      const activeClass = category === categoryInput.value ? "active" : "";
      const countText = subCount > 0 ? `${subCount} 個小分類` : "可新增小分類";

      return `
        <div class="menu-row swipe-row">
          <button type="button" class="menu-delete-btn" data-category="${escapeForAttribute(category)}" aria-label="刪除 ${escapeForAttribute(category)}">刪除</button>
          <button type="button" class="menu-item ${activeClass} menu-main-select" data-category="${escapeForAttribute(category)}">
            <span>
              ${escapeHtml(category)}
              <small>${countText}</small>
            </span>
            <span class="arrow">›</span>
          </button>
        </div>
      `;
    })
    .join("");

  menuList.querySelectorAll(".menu-main-select").forEach((button) => {
    button.addEventListener("click", (event) => {
      const row = button.closest(".swipe-row");

      if (row && row.classList.contains("swiped")) {
        event.preventDefault();
        row.classList.remove("swiped");
        return;
      }

      closeAllSwipeRows();
      renderSubCategoryMenu(button.dataset.category);
    });
  });

  menuList.querySelectorAll(".menu-delete-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteMainCategory(type, button.dataset.category);
    });
  });

  attachSwipeDeleteRows();
}





function renderSubCategoryMenu(category) {
  const type = getSelectedType();
  const list = [...(folderCategories[type][category] || [])].sort((a, b) => a.localeCompare(b, "zh-Hant"));

  menuParentCategory = category;
  menuBackBtn.style.visibility = "visible";
  menuTitle.textContent = category;
  menuSubtitle.textContent = "選擇小分類，或直接選不使用小分類；左滑可刪除";
  updateCategoryAddBox("sub");

  const noSubActive = categoryInput.value === category && !subCategoryInput.value ? "active" : "";

  const noSubButton = `
    <button type="button" class="menu-item ${noSubActive} menu-sub-select" data-subcategory="">
      <span>
        不使用小分類
        <small>只記在「${escapeHtml(category)}」底下</small>
      </span>
      <span class="arrow">✓</span>
    </button>
  `;

  const subButtons = list
    .map((subCategory) => {
      const activeClass = categoryInput.value === category && subCategoryInput.value === subCategory ? "active" : "";

      return `
        <div class="menu-row swipe-row">
          <button type="button" class="menu-delete-btn sub-delete" data-subcategory="${escapeForAttribute(subCategory)}" aria-label="刪除 ${escapeForAttribute(subCategory)}">刪除</button>
          <button type="button" class="menu-item ${activeClass} menu-sub-select" data-subcategory="${escapeForAttribute(subCategory)}">
            <span>
              ${escapeHtml(subCategory)}
              <small>${escapeHtml(category)} - ${escapeHtml(subCategory)}</small>
            </span>
            <span class="arrow">✓</span>
          </button>
        </div>
      `;
    })
    .join("");

  menuList.innerHTML = noSubButton + subButtons;

  menuList.querySelectorAll(".menu-sub-select").forEach((button) => {
    button.addEventListener("click", (event) => {
      const row = button.closest(".swipe-row");

      if (row && row.classList.contains("swiped")) {
        event.preventDefault();
        row.classList.remove("swiped");
        return;
      }

      closeAllSwipeRows();
      selectFinalCategory(category, button.dataset.subcategory || "");
    });
  });

  menuList.querySelectorAll(".sub-delete").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteSubCategory(type, category, button.dataset.subcategory);
    });
  });

  attachSwipeDeleteRows();
}





function selectFinalCategory(category, subCategory) {
  categoryInput.value = category;
  subCategoryInput.value = subCategory;
  updateCategoryButtonText();
  updateRecordAccountFieldState();
  closeMenu();
}

function saveNewSubCategory() {
  const type = getSelectedType();
  const category = menuParentCategory;
  const newName = newSubCategoryInput.value.trim();

  if (!category) {
    customAlert("請先選擇大分類");
    return;
  }

  if (!newName) {
    customAlert("請輸入小分類名稱");
    return;
  }

  if (!folderCategories[type][category]) {
    folderCategories[type][category] = [];
  }

  if (!folderCategories[type][category].includes(newName)) {
    folderCategories[type][category].push(newName);
    folderCategories[type][category].sort((a, b) => a.localeCompare(b, "zh-Hant"));
    saveFolderCategories();
  }

  newSubCategoryInput.value = "";
  renderSubCategoryMenu(category);
}



function updateCategoryButtonText() {
  const category = categoryInput.value;
  const subCategory = subCategoryInput.value;

  if (!category) {
    categoryButtonText.textContent = "選擇分類";
    return;
  }

  categoryButtonText.textContent = subCategory ? `${category} - ${subCategory}` : category;
}


function isCreditCardExpenseValues(type, category, subCategory = "") {
  if (type !== "expense") return false;

  const categoryName = normalizeText(category);
  const subCategoryName = normalizeText(subCategory);

  return (
    categoryName === "信用卡" ||
    categoryName === "信用卡支出" ||
    categoryName.includes("信用卡") ||
    subCategoryName.includes("信用卡")
  );
}

function isCurrentRecordCreditCardExpense() {
  return isCreditCardExpenseValues(getSelectedType(), categoryInput?.value, subCategoryInput?.value);
}

function updateRecordAccountFieldState() {
  if (!recordAccountField) return;

  const isCreditCardExpense = isCurrentRecordCreditCardExpense();

  recordAccountField.hidden = isCreditCardExpense;

  if (accountFieldHint) {
    accountFieldHint.textContent = isCreditCardExpense
      ? "信用卡消費不會扣現金或銀行帳戶，會整理到信用卡消費明細。"
      : "這筆錢是從哪裡來，或要記在哪個位置。";
  }

  if (isCreditCardExpense && accountSelect) {
    accountSelect.value = "";
    return;
  }

  if (!isCreditCardExpense && accountSelect && !accountSelect.value) {
    setSelectedAccount(getDefaultAccountId());
  }
}

function clearSelectedCategory() {
  categoryInput.value = "";
  subCategoryInput.value = "";
  updateCategoryButtonText();
  updateRecordAccountFieldState();
}

function render() {
  const selectedMonth = getSelectedMonthValue();

  const monthRecords = records
    .filter((record) => record.date.startsWith(selectedMonth))
    .sort((a, b) => {
      if (a.date === b.date) {
        return (b.createdAt || "").localeCompare(a.createdAt || "");
      }
      return b.date.localeCompare(a.date);
    });

  renderAccountOptions();
  renderSummary(monthRecords);
  renderAssetDebtStats(monthRecords);
  renderList(monthRecords);
  renderAccounts();
  renderDebts();
  renderCreditCardDetails();
}

function renderSummary(monthRecords) {
  const income = monthRecords
    .filter((record) => record.type === "income")
    .reduce((sum, record) => sum + Number(record.amount || 0), 0);

  const expense = monthRecords
    .filter((record) => record.type === "expense")
    .reduce((sum, record) => sum + Number(record.amount || 0), 0);

  const balance = income - expense;

  incomeAmount.textContent = money(income);
  expenseAmount.textContent = money(expense);
  balanceAmount.textContent = money(balance);

  if (statsIncomeAmount) statsIncomeAmount.textContent = money(income);
  if (statsExpenseAmount) statsExpenseAmount.textContent = money(expense);
  if (statsBalanceAmount) statsBalanceAmount.textContent = money(balance);

  const expenseByCategory = getExpenseByCategory(monthRecords);
  const top = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0];
  const topText = top ? `${top[0]} ${money(top[1])}` : "尚無資料";

  topCategory.textContent = topText;
  if (statsTopCategory) statsTopCategory.textContent = topText;

  if (statsStatus) {
    if (!income && !expense) {
      statsStatus.textContent = "尚無資料";
    } else if (balance >= 0) {
      statsStatus.textContent = "有結餘";
    } else {
      statsStatus.textContent = "超支";
    }
  }

  if (expenseRate && expenseRateBar && statsInsightText) {
    const rate = income > 0 ? Math.round((expense / income) * 100) : 0;
    const safeRate = Math.min(rate, 100);

    expenseRate.textContent = income > 0 ? `${rate}%` : "0%";
    expenseRateBar.style.width = `${safeRate}%`;

    if (!income && !expense) {
      statsInsightText.textContent = "有資料後，這裡會幫你看本月花費壓力。";
    } else if (income === 0 && expense > 0) {
      statsInsightText.textContent = "本月目前只有支出，記得補上收入才看得出完整收支。";
    } else if (rate <= 50) {
      statsInsightText.textContent = "這個月花費控制得不錯，結餘空間很舒服。";
    } else if (rate <= 80) {
      statsInsightText.textContent = "支出比例中等，可以留意月底是否還有大筆開銷。";
    } else if (rate <= 100) {
      statsInsightText.textContent = "支出已經接近收入，建議開始抓出最容易超支的分類。";
    } else {
      statsInsightText.textContent = "本月已經超支，先把非必要支出暫停會比較安全。";
    }
  }

  renderCategoryRank(expenseByCategory, expense);
}






function renderCategoryRank(expenseByCategory, totalExpense) {
  if (!categoryRankList) return;

  const entries = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    categoryRankList.innerHTML = `<div class="empty">本月還沒有支出資料</div>`;
    return;
  }

  categoryRankList.innerHTML = entries
    .map(([category, amount], index) => {
      const percent = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
      return `
        <div class="rank-item">
          <div class="rank-head">
            <span class="rank-number">${index + 1}</span>
            <div>
              <strong>${escapeHtml(category)}</strong>
              <small>${percent}%</small>
            </div>
            <b>${money(amount)}</b>
          </div>
          <div class="rank-bar">
            <div style="width: ${percent}%"></div>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderAssetDebtStats(monthRecords) {
  renderAssetOverview(monthRecords);
  renderLiabilityProgress();
}

function renderAssetOverview(monthRecords) {
  const totalIncome = records
    .filter((record) => record.type === "income")
    .reduce((sum, record) => sum + Number(record.amount || 0), 0);

  const totalExpense = records
    .filter((record) => record.type === "expense")
    .reduce((sum, record) => sum + Number(record.amount || 0), 0);

  const monthIncome = monthRecords
    .filter((record) => record.type === "income")
    .reduce((sum, record) => sum + Number(record.amount || 0), 0);

  const monthExpense = monthRecords
    .filter((record) => record.type === "expense")
    .reduce((sum, record) => sum + Number(record.amount || 0), 0);

  const netAsset = totalIncome - totalExpense;
  const monthBalance = monthIncome - monthExpense;
  const savingRatioRaw = totalIncome > 0 ? Math.round((netAsset / totalIncome) * 100) : 0;
  const savingRatio = clampNumber(savingRatioRaw, -999, 999);
  const savingBarWidth = clampNumber(savingRatioRaw, 0, 100);

  if (assetTotalBalance) assetTotalBalance.textContent = money(netAsset);
  if (assetTotalIncome) assetTotalIncome.textContent = money(totalIncome);
  if (assetTotalExpense) assetTotalExpense.textContent = money(totalExpense);
  if (assetMonthBalance) assetMonthBalance.textContent = money(monthBalance);
  if (savingRate) savingRate.textContent = `${savingRatio}%`;
  if (savingRateBar) savingRateBar.style.width = `${savingBarWidth}%`;

  if (assetBalanceHint) {
    if (!totalIncome && !totalExpense) {
      assetBalanceHint.textContent = "依照記帳的累積收入－支出估算";
    } else if (netAsset > 0) {
      assetBalanceHint.textContent = "目前累積資產是正數，表示整體仍有留住資金。";
    } else if (netAsset === 0) {
      assetBalanceHint.textContent = "目前累積收支打平，剛好沒有盈餘也沒有負值。";
    } else {
      assetBalanceHint.textContent = "目前累積支出高於收入，可以再留意現金流安排。";
    }
  }

  if (assetInsightText) {
    if (!totalIncome && !totalExpense) {
      assetInsightText.textContent = "有資料後，這裡會幫你整理資產累積狀況。";
    } else if (savingRatioRaw >= 30) {
      assetInsightText.textContent = "你的累積資產保留比例不錯，整體存下來的金額算健康。";
    } else if (savingRatioRaw >= 0) {
      assetInsightText.textContent = "目前還有正向累積，但如果想存更快，可以再壓低部分支出。";
    } else {
      assetInsightText.textContent = "目前整體是負向累積，建議優先控制支出或安排還款順序。";
    }
  }
}

function renderLiabilityProgress() {
  const debtDetails = debts.map((debt) => {
    const detail = getDebtDetail(debt);
    const paidBase = debt.type === "creditRevolving"
      ? Number(debt.totalPaid || detail.paidAmount || 0)
      : Number(detail.paidAmount || 0);
    const remainingBase = Number(detail.remainingAmount || 0);
    const totalBase = paidBase + remainingBase;
    const progress = totalBase > 0 ? Math.round((paidBase / totalBase) * 100) : Number(detail.progress || 0);

    return {
      debt,
      detail,
      paidBase,
      remainingBase,
      totalBase,
      progress: clampNumber(progress, 0, 100)
    };
  });

  const totalRemaining = debtDetails.reduce((sum, item) => sum + item.remainingBase, 0);
  const totalPaid = debtDetails.reduce((sum, item) => sum + item.paidBase, 0);
  const totalBase = debtDetails.reduce((sum, item) => sum + item.totalBase, 0);
  const overallProgress = totalBase > 0 ? Math.round((totalPaid / totalBase) * 100) : 0;

  if (liabilityRemainingTotal) liabilityRemainingTotal.textContent = money(totalRemaining);
  if (liabilityPaidTotal) liabilityPaidTotal.textContent = money(totalPaid);
  if (liabilityProgressText) liabilityProgressText.textContent = `${overallProgress}%`;
  if (liabilityItemCount) liabilityItemCount.textContent = `${debts.length} 筆`;
  if (liabilityOverallPercent) liabilityOverallPercent.textContent = `${overallProgress}%`;
  if (liabilityOverallBar) liabilityOverallBar.style.width = `${clampNumber(overallProgress, 0, 100)}%`;

  if (liabilityOverallHint) {
    if (debts.length === 0) {
      liabilityOverallHint.textContent = "目前還沒有還款項目。";
    } else if (overallProgress >= 80) {
      liabilityOverallHint.textContent = "大部分負債已經處理得差不多，繼續維持就很棒。";
    } else if (overallProgress >= 40) {
      liabilityOverallHint.textContent = "目前還款進度穩定中，已經走過一段路了。";
    } else {
      liabilityOverallHint.textContent = "目前負債還在前期階段，可以優先注意剩餘金額最高的項目。";
    }
  }

  if (!statsDebtProgressList) return;

  if (debtDetails.length === 0) {
    statsDebtProgressList.innerHTML = `<div class="empty">新增還款項目後，這裡會顯示每筆負債的進度條</div>`;
    return;
  }

  statsDebtProgressList.innerHTML = debtDetails
    .sort((a, b) => b.remainingBase - a.remainingBase)
    .map(({ debt, detail, remainingBase, progress }) => {
      const typeLabel = getDebtTypeLabel(debt.type);
      const titleAmountLabel = detail.isRevolving ? "卡循估算" : "剩餘金額";
      const subText = detail.isRevolving
        ? `當期帳單 ${money(detail.statementAmount || 0)}｜本期已繳 ${money(detail.paidAmount || 0)}`
        : `每月 ${money(detail.monthlyPayment || 0)}｜已繳 ${detail.paidPeriods || 0}/${detail.totalPeriods || 0} 期`;
      const caption = detail.isRevolving
        ? `循環利息 ${money(detail.currentInterest || 0)}｜信用卡支出 ${money(detail.linkedSpending || 0)}`
        : `還款進度 ${progress}%`;

      return `
        <article class="stats-debt-item">
          <div class="stats-debt-head">
            <div>
              <strong>${escapeHtml(debt.name)}</strong>
              <small>${typeLabel}｜${subText}</small>
            </div>
            <div class="stats-debt-amount">
              <span>${titleAmountLabel}</span>
              <b>${money(remainingBase)}</b>
            </div>
          </div>

          <div class="stats-mini-progress stats-debt-bar">
            <div style="width:${progress}%"></div>
          </div>

          <div class="stats-debt-foot">
            <span>${caption}</span>
            <span>${progress}%</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function getExpenseByCategory(monthRecords) {
  const expenseByCategory = {};

  monthRecords
    .filter((record) => record.type === "expense")
    .forEach((record) => {
      const category = record.category || "其他";
      expenseByCategory[category] =
        (expenseByCategory[category] || 0) + Number(record.amount || 0);
    });

  return expenseByCategory;
}

function renderList(monthRecords) {
  if (monthRecords.length === 0) {
    recordList.innerHTML = `<div class="empty">這個月份還沒有紀錄</div>`;
    return;
  }

  recordList.innerHTML = monthRecords
    .map((record) => {
      const isIncome = record.type === "income";
      const symbol = isIncome ? "+" : "-";
      const badgeText = isIncome ? "收入" : "支出";
      const badgeClass = isIncome ? "income-badge" : "expense-badge";
      const amountClass = isIncome ? "income" : "expense";
      const note = record.note ? record.note : "無備註";
      const subCategory = record.subCategory
        ? `<span class="record-subcategory">／${escapeHtml(record.subCategory)}</span>`
        : "";
      const isCreditCardExpense = isCreditCardExpenseRecord(record);
      const account = getAccountForRecord(record);
      const accountMeta = isCreditCardExpense
        ? `<span class="record-account credit-meta">信用卡消費｜不扣帳戶</span>`
        : account
          ? `<span class="record-account">${escapeHtml(getAccountDisplayLabel(account))}</span>`
          : `<span class="record-account muted">未指定帳戶</span>`;

      return `
        <article class="record-item">
          <div class="record-main">
            <div class="record-top">
              <span class="badge ${badgeClass}">${badgeText}</span>
              <span class="record-category">${escapeHtml(record.category || "其他")}</span>
              ${subCategory}
            </div>
            <div class="record-note">${escapeHtml(note)}</div>
            <div class="record-date">${record.date}｜${accountMeta}</div>
          </div>

          <div class="record-side">
            <span class="record-amount ${amountClass}">
              ${symbol}${money(record.amount)}
            </span>
            <div class="record-actions">
              <button class="edit-btn" type="button" onclick="editRecord('${record.id}')">
                編輯
              </button>
              <button class="delete-btn" type="button" onclick="deleteRecord('${record.id}')">
                刪除
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function deleteRecord(id) {
  const confirmed = confirm("確定要刪除這筆紀錄嗎？");

  if (!confirmed) return;

  records = records.filter((record) => record.id !== id);
  saveRecords();

  if (editingRecordId === id) {
    resetRecordFormAfterSubmit();
    resetRecordEditMode();
  }

  if (debtType) {
    debtType.addEventListener("change", updateDebtTypeFields);
  }

  [creditAmount, creditInstallments, creditPaidPeriods].forEach((input) => {
    if (input) input.addEventListener("input", updateDebtPreviews);
  });

  [loanPrincipal, loanAnnualRate, loanMonthlyPayment, loanPaidPeriods].forEach((input) => {
    if (input) input.addEventListener("input", updateDebtPreviews);
  });

  if (addDebtBtn) {
    addDebtBtn.addEventListener("click", addDebtItem);
  }

  updateDebtTypeFields();

  render();
}

function clearCurrentMonth() {
  const selectedMonth = getSelectedMonthValue();
  const count = records.filter((record) => record.date.startsWith(selectedMonth)).length;

  if (count === 0) {
    customAlert("這個月份沒有紀錄可以清空");
    return;
  }

  const confirmed = confirm(`確定要清空 ${selectedMonth} 的 ${count} 筆紀錄嗎？`);

  if (!confirmed) return;

  records = records.filter((record) => !record.date.startsWith(selectedMonth));
  saveRecords();

  if (editingRecordId && !records.some((record) => record.id === editingRecordId)) {
    resetRecordFormAfterSubmit();
    resetRecordEditMode();
  }

  if (debtType) {
    debtType.addEventListener("change", updateDebtTypeFields);
  }

  [creditAmount, creditInstallments, creditPaidPeriods].forEach((input) => {
    if (input) input.addEventListener("input", updateDebtPreviews);
  });

  [loanPrincipal, loanAnnualRate, loanMonthlyPayment, loanPaidPeriods].forEach((input) => {
    if (input) input.addEventListener("input", updateDebtPreviews);
  });

  if (addDebtBtn) {
    addDebtBtn.addEventListener("click", addDebtItem);
  }

  updateDebtTypeFields();

  render();
}

function exportBackup() {
  const data = {
    app: "Ray Money Book",
    version: 12,
    exportAt: new Date().toISOString(),
    records,
    accounts,
    folderCategories,
    debts
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ray-money-book-backup-${formatDate(new Date())}.json`;
  link.click();

  URL.revokeObjectURL(url);
}

function importBackup(event) {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function () {
    try {
      const imported = JSON.parse(reader.result);
      const importedRecords = Array.isArray(imported) ? imported : imported.records;

      if (!Array.isArray(importedRecords)) {
        customAlert("這個備份格式不正確");
        return;
      }

      const existingIds = new Set(records.map((record) => record.id));
      const cleanRecords = importedRecords.filter((record) => {
        return (
          record.id &&
          record.type &&
          record.amount &&
          record.category &&
          record.date &&
          !existingIds.has(record.id)
        );
      });

      records = [...records, ...cleanRecords];

      if (imported.folderCategories) {
        folderCategories = mergeFolderCategories(folderCategories, imported.folderCategories);
      }

      if (imported.categories) {
        folderCategories = importFlatCategories(folderCategories, imported.categories);
      }

      if (imported.accounts && Array.isArray(imported.accounts)) {
        accounts = mergeAccounts(accounts, imported.accounts);
      }

      if (imported.debts && Array.isArray(imported.debts)) {
        const existingDebtIds = new Set(debts.map((debt) => debt.id));
        const cleanDebts = imported.debts.filter((debt) => debt.id && !existingDebtIds.has(debt.id));
        debts = [...debts, ...cleanDebts];
      }

      saveRecords();
      saveAccounts();
      saveFolderCategories();
      saveDebts();
      render();

      customAlert(`匯入完成，新增 ${cleanRecords.length} 筆紀錄`, "匯入完成");
    } catch (error) {
      customAlert("匯入失敗，請確認檔案是不是 JSON 備份", "匯入失敗");
    } finally {
      importFile.value = "";
    }
  };

  reader.readAsText(file);
}


function setupAccountControls() {
  renderAccountOptions();
  updateAccountTypeButtonText();

  if (accountSelectButton) {
    accountSelectButton.addEventListener("click", openAccountSelector);
  }

  if (accountTypeButton) {
    accountTypeButton.addEventListener("click", openAccountTypeSelector);
  }

  if (customSelectClose) {
    customSelectClose.addEventListener("click", closeCustomSelect);
  }

  if (customSelectOverlay) {
    customSelectOverlay.addEventListener("click", (event) => {
      if (event.target === customSelectOverlay) closeCustomSelect();
    });
  }

  if (accountPanelToggle && accountPanelBody) {
    accountPanelToggle.addEventListener("click", () => {
      const willOpen = accountPanelBody.hidden;
      accountPanelBody.hidden = !willOpen;
      accountPanelToggle.setAttribute("aria-expanded", String(willOpen));
      accountPanelToggle.querySelector("b").textContent = willOpen ? "⌃" : "⌄";
      if (!willOpen) resetAccountForm();
    });
  }

  if (openAccountFormBtn) {
    openAccountFormBtn.addEventListener("click", () => prepareNewAccount("cash"));
  }

  if (saveAccountBtn) {
    saveAccountBtn.addEventListener("click", saveAccountFromForm);
  }

  if (cancelAccountEditBtn) {
    cancelAccountEditBtn.addEventListener("click", resetAccountForm);
  }
}

function getSelectedAccountId() {
  return accountSelect ? accountSelect.value : getDefaultAccountId();
}

function setSelectedAccount(accountId) {
  if (!accountSelect) return;
  const safeId = accountId && accounts.some((account) => account.id === accountId)
    ? accountId
    : getDefaultAccountId();

  accountSelect.value = safeId || "";
  updateAccountSelectButtonText();
}

function getDefaultAccountId() {
  const cash = accounts.find((account) => account.id === "cash_wallet");
  if (cash) return cash.id;
  return accounts[0] ? accounts[0].id : "";
}

function getRecordAccountId(record) {
  if (isCreditCardExpenseRecord(record)) {
    return "";
  }

  if (record && record.accountId && accounts.some((account) => account.id === record.accountId)) {
    return record.accountId;
  }

  if (record && record.accountName) {
    const matched = accounts.find((account) => account.name === record.accountName);
    if (matched) return matched.id;
  }

  return getDefaultAccountId();
}

function getAccountForRecord(record) {
  const accountId = getRecordAccountId(record);
  if (!accountId) return null;
  return accounts.find((account) => account.id === accountId) || null;
}

function renderAccountOptions() {
  if (!accountSelect) return;
  const currentValue = accountSelect.value || getDefaultAccountId();
  setSelectedAccount(currentValue);
}

function updateAccountSelectButtonText() {
  if (!accountSelectButtonText) return;
  const account = accounts.find((item) => item.id === getSelectedAccountId());

  if (!account) {
    accountSelectButtonText.textContent = "選擇帳戶";
    return;
  }

  accountSelectButtonText.textContent = getAccountDisplayLabel(account);
}

function updateAccountTypeButtonText() {
  if (!accountTypeButtonText || !accountTypeSelect) return;
  accountTypeButtonText.textContent = getAccountTypeLabel(accountTypeSelect.value || "cash");
}

function getSafeAccountType(type) {
  return accountTypeLabels[type] ? type : "cash";
}

function getAccountDisplayLabel(account) {
  if (!account) return "選擇帳戶";
  return `${getAccountTypeLabel(account.type)}｜${account.name}`;
}

function getAccountsByType(type) {
  return accounts.filter((account) => getSafeAccountType(account.type) === type);
}

function openCustomSelect({ title, subtitle, options, selectedValue, onSelect }) {
  if (!customSelectOverlay || !customSelectList) return;

  activeCustomSelectHandler = typeof onSelect === "function" ? onSelect : null;
  if (customSelectTitle) customSelectTitle.textContent = title || "選擇項目";
  if (customSelectSubtitle) customSelectSubtitle.textContent = subtitle || "請選擇一個選項";

  customSelectList.innerHTML = options
    .map((option) => {
      if (option.kind === "header") {
        const countText = typeof option.count === "number" ? `<small>${option.count} 個</small>` : "";
        return `
          <div class="custom-select-group-header">
            <span>${escapeHtml(option.label)}</span>
            ${countText}
          </div>
        `;
      }

      const activeClass = option.value === selectedValue ? "active" : "";
      const subText = option.subLabel ? `<small>${escapeHtml(option.subLabel)}</small>` : "";
      const arrow = option.value === selectedValue ? "✓" : "›";

      return `
        <button type="button" class="menu-item custom-select-option ${activeClass}" data-value="${escapeForAttribute(option.value)}">
          <span>
            ${escapeHtml(option.label)}
            ${subText}
          </span>
          <span class="arrow">${arrow}</span>
        </button>
      `;
    })
    .join("");

  customSelectList.querySelectorAll(".custom-select-option").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.value;
      if (activeCustomSelectHandler) activeCustomSelectHandler(value);
      closeCustomSelect();
    });
  });

  customSelectOverlay.hidden = false;
  document.body.classList.add("menu-open");
}

function closeCustomSelect() {
  if (customSelectOverlay) customSelectOverlay.hidden = true;
  document.body.classList.remove("menu-open");
  activeCustomSelectHandler = null;
}

function openAccountSelector() {
  const options = [];

  accountTypeOrder.forEach((type) => {
    const groupAccounts = accounts.filter((account) => getSafeAccountType(account.type) === type);
    if (!groupAccounts.length) return;

    options.push({
      kind: "header",
      label: getAccountTypeLabel(type),
      count: groupAccounts.length
    });

    groupAccounts.forEach((account) => {
      options.push({
        value: account.id,
        label: account.name,
        subLabel: getAccountTypeDescription(account.type)
      });
    });
  });

  options.push({
    value: "__manage_accounts__",
    label: "＋ 新增或管理帳戶",
    subLabel: "可在現金、銀行、存錢、其他底下新增帳戶名稱"
  });

  openCustomSelect({
    title: "選擇帳戶",
    subtitle: "依帳戶類型分組，選擇這筆錢要記在哪裡",
    options,
    selectedValue: getSelectedAccountId(),
    onSelect: (value) => {
      if (value === "__manage_accounts__") {
        openAccountPanel(true);
        return;
      }

      setSelectedAccount(value);
    }
  });
}

function openAccountTypeSelector() {
  const options = accountTypeOrder.map((type) => ({
    value: type,
    label: getAccountTypeLabel(type),
    subLabel: getAccountTypeDescription(type)
  }));

  openCustomSelect({
    title: "選擇帳戶類型",
    subtitle: "用來區分現金、銀行、存錢筒或其他資金位置",
    options,
    selectedValue: accountTypeSelect ? accountTypeSelect.value : "cash",
    onSelect: (value) => {
      if (!accountTypeSelect) return;
      accountTypeSelect.value = getSafeAccountType(value || "cash");
      updateAccountTypeButtonText();
      if (accountNameInput && !editingAccountId) {
        accountNameInput.placeholder = getAccountNamePlaceholder(accountTypeSelect.value);
      }
    }
  });
}

function openAccountPanel(shouldScroll = false) {
  if (accountPanelBody) accountPanelBody.hidden = false;
  if (accountPanelToggle) {
    accountPanelToggle.setAttribute("aria-expanded", "true");
    const icon = accountPanelToggle.querySelector("b");
    if (icon) icon.textContent = "⌃";
  }

  if (shouldScroll && accountPanelToggle) {
    setTimeout(() => {
      accountPanelToggle.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }
}

function getAccountTypeDescription(type) {
  const descriptions = {
    cash: "例如現金錢包、零用金",
    bank: "例如薪轉戶、活存帳戶",
    saving: "例如存錢筒、旅遊基金",
    other: "其他想自己分類的資金位置"
  };

  return descriptions[type] || descriptions.other;
}

function renderAccounts() {
  if (!accountList) return;

  const accountStats = getAccountStats();

  accountList.innerHTML = accountTypeOrder
    .map((type) => {
      const groupAccounts = getAccountsByType(type);
      const totalBalance = groupAccounts.reduce((sum, account) => {
        const stats = accountStats[account.id] || { balance: Number(account.initialBalance || 0) };
        return sum + Number(stats.balance || 0);
      }, 0);
      const accountItems = groupAccounts.length
        ? groupAccounts
            .map((account) => {
              const stats = accountStats[account.id] || { income: 0, expense: 0, balance: Number(account.initialBalance || 0), usedCount: 0 };
              const balanceLabel = "目前估算";
              const balanceClass = stats.balance >= 0 ? "income" : "expense";
              const usedText = stats.usedCount > 0 ? `已使用 ${stats.usedCount} 筆` : "尚未使用";

              return `
                <article class="account-item">
                  <div class="account-main">
                    <div class="account-name-row">
                      <strong>${escapeHtml(account.name)}</strong>
                      <span>${getAccountTypeLabel(account.type)}</span>
                    </div>
                    <small>初始金額 ${money(account.initialBalance || 0)}｜${usedText}</small>
                  </div>
                  <div class="account-side">
                    <span>${balanceLabel}</span>
                    <b class="${balanceClass}">${money(stats.balance)}</b>
                    <div class="record-actions account-actions">
                      <button class="edit-btn" type="button" onclick="editAccount('${escapeForAttribute(account.id)}')">編輯</button>
                      <button class="delete-btn" type="button" onclick="deleteAccount('${escapeForAttribute(account.id)}')">刪除</button>
                    </div>
                  </div>
                </article>
              `;
            })
            .join("")
        : `<div class="empty account-group-empty">目前還沒有${getAccountTypeLabel(type)}帳戶</div>`;

      return `
        <details class="account-type-group">
          <summary class="account-group-head">
            <div>
              <strong>${getAccountTypeLabel(type)}</strong>
              <small>${groupAccounts.length} 個帳戶｜${getAccountTypeDescription(type)}</small>
            </div>
            <span class="account-group-total">${money(totalBalance)}</span>
          </summary>
          <div class="account-group-list">
            ${accountItems}
          </div>
        </details>
      `;
    })
    .join("");
}

function getAccountStats() {
  const stats = {};

  accounts.forEach((account) => {
    stats[account.id] = {
      income: 0,
      expense: 0,
      usedCount: 0,
      balance: Number(account.initialBalance || 0)
    };
  });

  records.forEach((record) => {
    if (isCreditCardExpenseRecord(record)) return;

    const accountId = getRecordAccountId(record);
    if (!stats[accountId]) return;

    const amount = Number(record.amount || 0);
    const account = accounts.find((item) => item.id === accountId);
    stats[accountId].usedCount += 1;

    if (record.type === "income") {
      stats[accountId].income += amount;
      stats[accountId].balance += amount;
    } else {
      stats[accountId].expense += amount;
      stats[accountId].balance -= amount;
    }
  });

  return stats;
}

function prepareNewAccount(type = "cash") {
  openAccountPanel(true);
  resetAccountForm(false);
  showAccountForm();
  if (accountTypeSelect) accountTypeSelect.value = getSafeAccountType(type);
  updateAccountTypeButtonText();
  if (accountNameInput) {
    accountNameInput.focus();
    accountNameInput.placeholder = getAccountNamePlaceholder(type);
  }
}

function getAccountNamePlaceholder(type) {
  const placeholders = {
    cash: "例如：現金錢包、零用金",
    bank: "例如：玉山銀行、凱基銀行、郵局",
    saving: "例如：存錢筒、旅遊基金、緊急預備金",
    other: "例如：Line Pay、街口支付、悠遊卡"
  };

  return placeholders[getSafeAccountType(type)] || placeholders.other;
}

function saveAccountFromForm() {
  if (!accountNameInput || !accountTypeSelect || !accountInitialInput) return;

  const name = accountNameInput.value.trim();
  const type = getSafeAccountType(accountTypeSelect.value || "cash");
  const initialBalance = Number(accountInitialInput.value || 0);

  if (!name) {
    customAlert("請輸入帳戶名稱");
    return;
  }

  const duplicate = accounts.some((account) => account.name === name && account.id !== editingAccountId);
  if (duplicate) {
    customAlert("已經有同名帳戶，請換一個名稱");
    return;
  }

  if (editingAccountId) {
    const index = accounts.findIndex((account) => account.id === editingAccountId);
    if (index === -1) {
      customAlert("找不到要修改的帳戶，請重新選擇一次。", "修改失敗");
      resetAccountForm();
      return;
    }

    accounts[index] = {
      ...accounts[index],
      name,
      type,
      initialBalance,
      updatedAt: new Date().toISOString()
    };
  } else {
    accounts.push({
      id: `account_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      name,
      type,
      initialBalance,
      createdAt: new Date().toISOString()
    });
  }

  saveAccounts();
  resetAccountForm(true);
  render();
}

function editAccount(id) {
  const account = accounts.find((item) => item.id === id);
  if (!account) {
    customAlert("找不到這個帳戶，可能已經被刪除了。", "無法編輯");
    return;
  }

  openAccountPanel(true);
  showAccountForm();

  editingAccountId = id;
  accountNameInput.value = account.name || "";
  accountTypeSelect.value = getSafeAccountType(account.type || "cash");
  updateAccountTypeButtonText();
  if (accountNameInput) accountNameInput.placeholder = getAccountNamePlaceholder(accountTypeSelect.value);
  accountInitialInput.value = account.initialBalance || 0;
  saveAccountBtn.textContent = "儲存帳戶修改";
  if (cancelAccountEditBtn) cancelAccountEditBtn.hidden = false;
  accountNameInput.focus();
}

async function deleteAccount(id) {
  const account = accounts.find((item) => item.id === id);
  if (!account) return;

  const usedCount = records.filter((record) => getRecordAccountId(record) === id).length;
  if (usedCount > 0) {
    customAlert(`「${account.name}」已經有 ${usedCount} 筆紀錄使用中，為了避免資料錯亂，請先把那些紀錄改到其他帳戶後再刪除。`, "無法刪除帳戶");
    return;
  }

  if (accounts.length <= 1) {
    customAlert("至少要保留一個帳戶");
    return;
  }

  const confirmed = await customConfirm(`確定要刪除帳戶「${account.name}」嗎？`, "刪除帳戶");
  if (!confirmed) return;

  accounts = accounts.filter((item) => item.id !== id);
  saveAccounts();

  if (editingAccountId === id) {
    resetAccountForm();
  }

  render();
}

function showAccountForm() {
  if (accountForm) accountForm.hidden = false;
  if (openAccountFormBtn) openAccountFormBtn.hidden = true;
}

function hideAccountForm() {
  if (accountForm) accountForm.hidden = true;
  if (openAccountFormBtn) openAccountFormBtn.hidden = false;
}

function resetAccountForm(shouldHide = true) {
  editingAccountId = null;
  if (accountNameInput) {
    accountNameInput.value = "";
    accountNameInput.placeholder = getAccountNamePlaceholder("cash");
  }
  if (accountTypeSelect) accountTypeSelect.value = "cash";
  updateAccountTypeButtonText();
  if (accountInitialInput) accountInitialInput.value = "0";
  if (saveAccountBtn) saveAccountBtn.textContent = "新增帳戶";
  if (cancelAccountEditBtn) cancelAccountEditBtn.hidden = true;
  if (shouldHide) hideAccountForm();
}

function getAccountTypeLabel(type) {
  return accountTypeLabels[getSafeAccountType(type)] || accountTypeLabels.other;
}

function loadAccounts() {
  try {
    const data = localStorage.getItem(ACCOUNT_STORAGE_KEY);
    if (!data) return clone(defaultAccounts);
    return normalizeAccounts(JSON.parse(data));
  } catch (error) {
    return clone(defaultAccounts);
  }
}

function normalizeAccounts(source) {
  const rawList = Array.isArray(source) ? source : [];
  const usedIds = new Set();
  const normalized = rawList
    .map((account, index) => {
      const name = String(account && account.name ? account.name : "").trim();
      if (!name) return null;

      let safeId = sanitizeAccountId(account.id || `account_${Date.now()}_${index}`);
      while (usedIds.has(safeId)) {
        safeId = `${safeId}_${index}`;
      }
      usedIds.add(safeId);

      const rawType = account && account.type === "credit" ? "other" : getSafeAccountType(account.type);

      return {
        id: safeId,
        name,
        type: rawType,
        initialBalance: Number(account.initialBalance || 0),
        createdAt: account.createdAt || new Date().toISOString(),
        updatedAt: account.updatedAt || ""
      };
    })
    .filter(Boolean);

  const recordList = Array.isArray(records) ? records : [];
  const cleaned = normalized.filter((account) => {
    const isOldDefaultCredit = account.id === "credit_card" && account.createdAt === "default";
    const isUsed = recordList.some((record) => record.accountId === account.id || record.accountName === account.name);
    return !(isOldDefaultCredit && !isUsed);
  });

  return cleaned.length ? cleaned : clone(defaultAccounts);
}

function sanitizeAccountId(id) {
  const cleanId = String(id || "")
    .trim()
    .replace(/[^A-Za-z0-9_-]/g, "_");
  return cleanId || `account_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function mergeAccounts(current, importedAccounts) {
  const merged = normalizeAccounts(current);
  const existingIds = new Set(merged.map((account) => account.id));
  const existingNames = new Set(merged.map((account) => account.name));

  normalizeAccounts(importedAccounts).forEach((account) => {
    if (existingIds.has(account.id) || existingNames.has(account.name)) return;
    merged.push(account);
  });

  return merged;
}

function saveAccounts() {
  localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts));
}

function loadRecords() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}

function loadFolderCategories() {
  try {
    const data = localStorage.getItem(FOLDER_CATEGORY_STORAGE_KEY);
    if (!data) {
      return clone(defaultFolderCategories);
    }

    const saved = JSON.parse(data);
    return normalizeFolderCategories(saved);
  } catch (error) {
    return clone(defaultFolderCategories);
  }
}




function normalizeFolderCategories(source) {
  const normalized = { expense: {}, income: {} };

  ["expense", "income"].forEach((type) => {
    const group = source && source[type] && typeof source[type] === "object" ? source[type] : {};
    Object.keys(group).forEach((mainCategory) => {
      const cleanMain = String(mainCategory || "").trim();
      if (!cleanMain) return;
      normalized[type][cleanMain] = uniqueList(Array.isArray(group[mainCategory]) ? group[mainCategory] : []);
    });
  });

  const hasAny = Object.keys(normalized.expense).length || Object.keys(normalized.income).length;
  return hasAny ? normalized : clone(defaultFolderCategories);
}

function mergeFolderCategories(base, extra) {
  const merged = clone(base || defaultFolderCategories);

  ["expense", "income"].forEach((type) => {
    if (!merged[type]) merged[type] = {};

    const extraGroup = extra && extra[type] ? extra[type] : {};
    Object.keys(extraGroup).forEach((mainCategory) => {
      if (!merged[type][mainCategory]) {
        merged[type][mainCategory] = [];
      }

      merged[type][mainCategory] = uniqueList([
        ...merged[type][mainCategory],
        ...(Array.isArray(extraGroup[mainCategory]) ? extraGroup[mainCategory] : [])
      ]);
    });
  });

  return merged;
}

function importFlatCategories(current, flatCategories) {
  const merged = clone(current);

  ["expense", "income"].forEach((type) => {
    const list = flatCategories[type] || [];
    list.forEach((category) => {
      if (!merged[type][category]) {
        merged[type][category] = [];
      }
    });
  });

  return merged;
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function saveFolderCategories() {
  localStorage.setItem(FOLDER_CATEGORY_STORAGE_KEY, JSON.stringify(folderCategories));
}

function getSelectedType() {
  return document.querySelector("input[name='type']:checked").value;
}

function uniqueList(list) {
  return list
    .map((item) => String(item).trim())
    .filter((item, index, array) => item && array.indexOf(item) === index);
}

function money(number) {
  return `$${Number(number).toLocaleString("zh-TW")}`;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatMonth(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}


function formatDateLabel(rawDate) {
  if (!rawDate) return "";
  return rawDate.replace(/-/g, "/");
}

function setDateInputValue(rawDate) {
  if (!dateInput) return;
  dateInput.dataset.raw = rawDate;
  dateInput.value = formatDateLabel(rawDate);
}

function getDateInputValue() {
  return dateInput?.dataset?.raw || "";
}

function formatFullDateLabel(date) {
  const weekdays = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}年${month}月${day}日 ${weekdays[date.getDay()]}`;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeForAttribute(text) {
  return escapeHtml(text).replaceAll("`", "&#096;");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}


function updateDebtTypeFields() {
  if (!debtType) return;

  const type = debtType.value;
  const isCreditCard = type === "creditCard";
  const isRevolving = type === "creditRevolving";
  const isFormulaLoan = !isCreditCard && !isRevolving;

  creditCardFields.hidden = !isCreditCard;
  revolvingFields.hidden = !isRevolving;
  loanFormulaFields.hidden = !isFormulaLoan;

  if (isRevolving && revolvingLinkedSubCategory && !revolvingLinkedSubCategory.value.trim()) {
    revolvingLinkedSubCategory.value = debtName.value.trim();
  }

  updateDebtPreviews();
}

function updateDebtPreviews() {
  updateCreditPreview();
  updateLoanPreview();
  updateRevolvingPreview();
}

function updateCreditPreview() {
  if (!creditPreview) return;

  const amount = Number(creditAmount.value);
  const installments = Number(creditInstallments.value);
  const paidPeriods = Number(creditPaidPeriods.value || 0);

  if (!amount || !installments) {
    creditPreview.textContent = "輸入金額與期數後，會自動計算每期金額。";
    return;
  }

  const perPeriod = Math.round(amount / installments);
  const paidAmount = Math.min(perPeriod * paidPeriods, amount);
  const remaining = Math.max(amount - paidAmount, 0);

  creditPreview.innerHTML = `
    每期約 ${money(perPeriod)}<br>
    已繳約 ${money(paidAmount)}，剩餘約 ${money(remaining)}
  `;
}

function updateLoanPreview() {
  if (!loanPreview) return;

  const principal = Number(loanPrincipal.value);
  const annualRate = Number(loanAnnualRate.value || 0);
  const monthlyPayment = Number(loanMonthlyPayment.value);
  const paidPeriods = Number(loanPaidPeriods.value || 0);

  if (!principal || !monthlyPayment) {
    loanPreview.textContent = "輸入貸款資料後，會自動估算剩餘本金與期數。";
    return;
  }

  const result = calculateLoanProgress(principal, annualRate, monthlyPayment, paidPeriods);

  if (result.error) {
    loanPreview.textContent = result.error;
    return;
  }

  loanPreview.innerHTML = `
    預估總期數：約 ${result.totalPeriods} 期<br>
    剩餘本金：約 ${money(result.remainingPrincipal)}<br>
    還款進度：約 ${result.progress}%
  `;
}




function updateRevolvingPreview() {
  if (!revolvingPreview) return;

  const statementAmount = Number(revolvingPrincipal.value || 0);
  const annualRate = Number(revolvingAnnualRate.value || 0);
  const interestDays = Number(revolvingInterestDays.value || 30);
  const payment = Number(revolvingPayment.value || 0);
  const linkedCardName = revolvingLinkedSubCategory.value.trim();
  const linkedCreditExpense = linkedCardName ? getLinkedCreditCardSpending(linkedCardName) : 0;

  if (!statementAmount) {
    revolvingPreview.textContent = "輸入當期帳單金額後，會自動顯示循環利息。";
    return;
  }

  if (annualRate <= 0) {
    const currentRemaining = Math.max(statementAmount - payment, 0);
    revolvingPreview.innerHTML = `
      當期剩餘：約 ${money(Math.round(currentRemaining))}<br>
      循環利息：請先輸入循環年利率<br>
      信用卡支出連動：約 ${money(Math.round(linkedCreditExpense))}
    `;
    return;
  }

  const result = calculateCreditRevolving({
    statementAmount,
    payment,
    annualRate,
    interestDays,
    linkedCreditExpense
  });

  revolvingPreview.innerHTML = `
    當期剩餘：約 ${money(result.currentRemaining)}<br>
    循環利息：約 ${money(result.currentInterest)}<br>
    信用卡支出連動：約 ${money(result.linkedCreditExpense)}<br>
    卡循估算：約 ${money(result.carryForward)}
  `;
}





















function addDebtItem() {
  const type = debtType.value;
  const name = debtName.value.trim() || getDebtTypeLabel(type);

  if (type === "creditCard") {
    addCreditCardDebt(name);
    return;
  }

  if (type === "creditRevolving") {
    addRevolvingDebt(name);
    return;
  }

  addFormulaLoanDebt(type, name);
}

function addCreditCardDebt(name) {
  const amount = Number(creditAmount.value);
  const installments = Number(creditInstallments.value);
  const paidPeriods = Number(creditPaidPeriods.value || 0);

  if (!amount || amount <= 0) {
    customAlert("請輸入刷卡金額");
    return;
  }

  if (!installments || installments <= 0) {
    customAlert("請輸入期數");
    return;
  }

  const safePaidPeriods = clampNumber(paidPeriods, 0, installments);
  const monthlyPayment = Math.round(amount / installments);

  debts.push({
    id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    type: "creditCard",
    name,
    amount,
    installments,
    monthlyPayment,
    paidPeriods: safePaidPeriods,
    createdAt: new Date().toISOString()
  });

  saveDebts();
  clearDebtForm();
  closeDebtModal();
  renderDebts();
}


function addRevolvingDebt(name) {
  const statementAmount = Number(revolvingPrincipal.value || 0);
  const annualRate = Number(revolvingAnnualRate.value || 0);
  const interestDays = Number(revolvingInterestDays.value || 30);
  const payment = Number(revolvingPayment.value || 0);
  const linkedSubCategory = revolvingLinkedSubCategory.value.trim() || name;

  if (statementAmount <= 0) {
    customAlert("請輸入當期帳單金額");
    return;
  }

  if (annualRate < 0) {
    customAlert("請確認循環年利率");
    return;
  }

  if (!interestDays || interestDays <= 0) {
    customAlert("請輸入計息天數");
    return;
  }

  ensureCreditExpenseSubCategory(linkedSubCategory);

  debts.push({
    id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    type: "creditRevolving",
    name,
    statementAmount,
    annualRate,
    interestDays,
    monthlyPayment: payment,
    totalPaid: 0,
    linkedSubCategory,
    appliedRecordIds: [],
    expanded: true,
    createdAt: new Date().toISOString()
  });

  saveFolderCategories();
  saveDebts();
  clearDebtForm();
  closeDebtModal();
  renderDebts();
}







function addFormulaLoanDebt(type, name) {
  const principal = Number(loanPrincipal.value);
  const annualRate = Number(loanAnnualRate.value || 0);
  const monthlyPayment = Number(loanMonthlyPayment.value);
  const paidPeriods = Number(loanPaidPeriods.value || 0);

  if (!principal || principal <= 0) {
    customAlert("請輸入貸款金額");
    return;
  }

  if (!monthlyPayment || monthlyPayment <= 0) {
    customAlert("請輸入每月還款金額");
    return;
  }

  const result = calculateLoanProgress(principal, annualRate, monthlyPayment, paidPeriods);

  if (result.error) {
    customAlert(result.error, "資料提醒");
    return;
  }

  debts.push({
    id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    type,
    name,
    principal,
    annualRate,
    monthlyPayment,
    paidPeriods: clampNumber(paidPeriods, 0, result.totalPeriods),
    createdAt: new Date().toISOString()
  });

  saveDebts();
  clearDebtForm();
  closeDebtModal();
  renderDebts();
}

function clearDebtForm() {
  debtName.value = "";
  creditAmount.value = "";
  creditInstallments.value = "";
  creditPaidPeriods.value = "0";
  loanPrincipal.value = "";
  loanAnnualRate.value = "";
  loanMonthlyPayment.value = "";
  loanPaidPeriods.value = "0";
  revolvingPrincipal.value = "";
  revolvingAnnualRate.value = "";
  revolvingInterestDays.value = "30";
  revolvingPayment.value = "";
  revolvingLinkedSubCategory.value = "";
  updateDebtPreviews();
}

function renderDebts() {
  if (!debtList) return;

  debtCount.textContent = `${debts.length} 筆`;

  const monthlyTotal = debts.reduce((sum, debt) => {
    return sum + getDebtMonthlyPayment(debt);
  }, 0);

  debtMonthlyTotal.textContent = money(monthlyTotal);

  if (debts.length === 0) {
    debtList.innerHTML = `<div class="empty">目前還沒有還款項目</div>`;
    return;
  }

  debtList.innerHTML = debts
    .map((debt) => renderDebtItem(debt))
    .join("");
}

function renderCreditCardDetails() {
  if (!creditCardDetailList) return;

  const selectedMonth = creditDetailMonthFilter?.dataset?.month || getSelectedMonthValue();
  const creditRecords = records
    .filter((record) => {
      return (
        record.date &&
        record.date.startsWith(selectedMonth) &&
        isCreditCardExpenseRecord(record)
      );
    })
    .sort((a, b) => {
      if (a.date === b.date) {
        return (b.createdAt || "").localeCompare(a.createdAt || "");
      }
      return b.date.localeCompare(a.date);
    });

  const total = creditRecords.reduce((sum, record) => sum + Number(record.amount || 0), 0);

  if (creditDetailTotal) creditDetailTotal.textContent = money(total);
  if (creditDetailCount) creditDetailCount.textContent = `${creditRecords.length} 筆`;

  if (creditRecords.length === 0) {
    creditCardDetailList.innerHTML = `
      <div class="empty">
        這個月份還沒有信用卡消費。<br>
        本月紀錄中分類選「信用卡」，小分類選「中國信託、凱基、玉山」之類，就會自動整理到這裡。
      </div>
    `;
    return;
  }

  const groups = [];
  const groupMap = {};

  creditRecords.forEach((record) => {
    const group = getCreditCardGroup(record);

    if (!groupMap[group.key]) {
      groupMap[group.key] = {
        ...group,
        total: 0,
        records: []
      };
      groups.push(groupMap[group.key]);
    }

    groupMap[group.key].total += Number(record.amount || 0);
    groupMap[group.key].records.push(record);
  });

  creditCardDetailList.innerHTML = groups
    .sort((a, b) => b.total - a.total)
    .map((group) => {
      const details = group.records
        .map((record) => {
          const note = record.note ? escapeHtml(record.note) : "無備註";
          const categoryLabel = getCreditRecordCategoryLabel(record, group.name);

          return `
            <div class="credit-detail-row">
              <div>
                <strong>${formatDateLabel(record.date)}</strong>
                <small>${escapeHtml(categoryLabel)}｜${note}</small>
              </div>
              <b>${money(record.amount || 0)}</b>
            </div>
          `;
        })
        .join("");

      return `
        <details class="credit-card-group" open>
          <summary>
            <span>
              <strong>${escapeHtml(group.name)}</strong>
              <small>${group.records.length} 筆消費｜${escapeHtml(group.typeLabel)}</small>
            </span>
            <b>${money(group.total)}</b>
          </summary>
          <div class="credit-card-records">
            ${details}
          </div>
        </details>
      `;
    })
    .join("");
}

function isCreditCardExpenseRecord(record) {
  if (!record) return false;
  return isCreditCardExpenseValues(record.type, record.category, record.subCategory);
}

function getCreditCardGroup(record) {
  const categoryName = normalizeText(record.category || "信用卡");
  const subCategoryName = normalizeText(record.subCategory);
  const cardName = getCreditCardNameFromRecord(categoryName, subCategoryName);
  const groupKey = `${categoryName}__${cardName}`;

  return {
    key: `credit_category_${encodeURIComponent(groupKey)}`,
    name: cardName,
    typeLabel: "本月紀錄分類"
  };
}

function getCreditCardNameFromRecord(categoryName, subCategoryName) {
  if (subCategoryName) return subCategoryName;

  const stripped = categoryName
    .replace(/^信用卡支出\s*[\/／｜|-]?\s*/, "")
    .replace(/^信用卡\s*[\/／｜|-]?\s*/, "")
    .trim();

  return stripped || "未指定卡別";
}

function getCreditRecordCategoryLabel(record, groupName) {
  const category = normalizeText(record.category || "其他");
  const subCategory = normalizeText(record.subCategory || "");

  if (!subCategory || subCategory === groupName) return category;
  return `${category}／${subCategory}`;
}

function normalizeText(value) {
  return String(value || "").trim();
}


function renderDebtItem(debt) {
  const detail = getDebtDetail(debt);
  const safeProgress = clampNumber(Number(detail.progress || 0), 0, 100);
  const isExpanded = debt.expanded !== false;
  const typeLabel = getDebtTypeLabel(debt.type);

  const compactLabel = detail.isRevolving ? "卡循估算" : "剩餘";
  const compactValue = detail.isRevolving ? detail.remainingAmount || 0 : detail.remainingAmount || 0;
  const progressCaption = detail.isRevolving
    ? `已繳 ${money(detail.paidAmount || 0)} / 帳單 ${money(detail.statementAmount || 0)}`
    : `已繳 ${detail.paidPeriods || 0} / ${detail.totalPeriods || 0} 期`;

  const compactMeta = detail.isRevolving
    ? `循環利息 ${money(detail.currentInterest || 0)}｜信用卡支出 ${money(detail.linkedSpending || 0)}`
    : `每月 ${money(detail.monthlyPayment || 0)}｜${detail.paidPeriods || 0}/${detail.totalPeriods || 0} 期`;

  const heroHtml = detail.isRevolving
    ? `
      <section class="debt-hero debt-hero-revolving">
        <div class="debt-hero-main">
          <span class="debt-hero-label">卡循估算</span>
          <strong>${money(detail.remainingAmount || 0)}</strong>
          <small>當期剩餘 ${money(detail.currentRemaining || 0)} ＋ 信用卡支出 ${money(detail.linkedSpending || 0)}</small>
        </div>
        <div class="debt-hero-side">
          <span class="debt-badge">${safeProgress}% 已繳</span>
          <div class="progress-track debt-inline-progress">
            <div class="progress-bar" style="width:${safeProgress}%"></div>
          </div>
          <small>${money(detail.paidAmount || 0)} / ${money(detail.statementAmount || 0)}</small>
        </div>
      </section>
    `
    : `
      <section class="debt-hero">
        <div class="debt-hero-main">
          <span class="debt-hero-label">剩餘本金</span>
          <strong>${money(detail.remainingAmount || 0)}</strong>
          <small>已繳 ${money(detail.paidAmount || 0)}｜每月 ${money(detail.monthlyPayment || 0)}</small>
        </div>
        <div class="debt-hero-side">
          <span class="debt-badge">${safeProgress}%</span>
          <div class="progress-track debt-inline-progress">
            <div class="progress-bar" style="width:${safeProgress}%"></div>
          </div>
          <small>${detail.paidPeriods || 0} / ${detail.totalPeriods || 0} 期</small>
        </div>
      </section>
    `;

  const extraStatsHtml = (detail.extraStats || [])
    .map((stat) => `
      <div class="debt-stat ${stat.wide ? "wide" : ""}">
        <span>${stat.label}</span>
        <strong>${stat.value}</strong>
      </div>
    `)
    .join("");

  const mainStatsHtml = detail.isRevolving
    ? `
      <div class="debt-stat">
        <span>當期帳單</span>
        <strong>${money(detail.statementAmount || 0)}</strong>
      </div>
      <div class="debt-stat">
        <span>當期已繳</span>
        <strong>${money(detail.paidAmount || 0)}</strong>
      </div>
      <div class="debt-stat">
        <span>當期剩餘</span>
        <strong>${money(detail.currentRemaining || 0)}</strong>
      </div>
      <div class="debt-stat">
        <span>循環利息</span>
        <strong>${money(detail.currentInterest || 0)}</strong>
      </div>
    `
    : `
      <div class="debt-stat">
        <span>每月要繳</span>
        <strong>${money(detail.monthlyPayment || 0)}</strong>
      </div>
      <div class="debt-stat">
        <span>還款狀態</span>
        <strong>${detail.paidPeriods || 0} / ${detail.totalPeriods || 0} 期</strong>
      </div>
      <div class="debt-stat">
        <span>已繳金額</span>
        <strong>${money(detail.paidAmount || 0)}</strong>
      </div>
      <div class="debt-stat">
        <span>還款進度</span>
        <strong>${safeProgress}%</strong>
      </div>
    `;

  return `
    <article class="debt-item ${isExpanded ? "expanded" : "collapsed"}">
      <button class="debt-toggle" type="button" onclick="toggleDebtDetails('${debt.id}')">
        <div class="debt-compact-card">
          <div class="debt-compact-top">
            <div class="debt-compact-title-block">
              <div class="debt-compact-title">
                <span class="debt-name">${debt.name}</span>
                <span class="debt-type-chip ${detail.isRevolving ? "revolving" : ""}">${typeLabel}</span>
              </div>
              <div class="debt-compact-meta">${compactMeta}</div>
            </div>

            <div class="debt-compact-amount">
              <span>${compactLabel}</span>
              <strong>${money(compactValue)}</strong>
            </div>
          </div>

          <div class="debt-compact-bottom">
            <div>
              <div class="progress-track debt-compact-progress">
                <div class="progress-bar" style="width:${safeProgress}%"></div>
              </div>
              <div class="debt-progress-caption">${progressCaption}</div>
            </div>
            <span class="debt-arrow">›</span>
          </div>
        </div>
      </button>

      <div class="debt-detail">
        ${heroHtml}
        ${detail.note ? `<p class="debt-note">${detail.note}</p>` : ""}

        <div class="debt-stats">
          ${mainStatsHtml}
          ${extraStatsHtml}
        </div>

        <div class="debt-actions">
          <button class="debt-pay-btn" onclick="event.stopPropagation(); checkDebtPayment('${debt.id}')">
            ${detail.isRevolving ? "當期已繳" : "本期已繳"}
          </button>
          <button class="debt-delete-btn" onclick="event.stopPropagation(); deleteDebt('${debt.id}')">刪除</button>
        </div>
      </div>
    </article>
  `;
}







function openDebtModal() {
  if (!debtModal) return;

  debtModal.hidden = false;
  document.body.classList.add("debt-modal-open");
  updateDebtTypeFields();
}

function closeDebtModal() {
  if (!debtModal) return;

  debtModal.hidden = true;
  document.body.classList.remove("debt-modal-open");
}

function toggleDebtDetails(id) {
  debts = debts.map((debt) => {
    if (debt.id === id) {
      return {
        ...debt,
        expanded: debt.expanded !== true
      };
    }

    return debt;
  });

  saveDebts();
  renderDebts();
}


function getLinkedCreditCardSpending(cardName) {
  if (!cardName) return 0;

  return records
    .filter((record) => {
      return (
        record.type === "expense" &&
        record.category === "信用卡支出" &&
        record.subCategory === cardName
      );
    })
    .reduce((sum, record) => sum + Number(record.amount || 0), 0);
}





function getDebtDetail(debt) {
  if (debt.type === "creditCard") {
    const totalPeriods = Number(debt.installments || 0);
    const paidPeriods = clampNumber(Number(debt.paidPeriods || 0), 0, totalPeriods);
    const monthlyPayment = Number(debt.monthlyPayment || Math.round(debt.amount / debt.installments));
    const paidAmount = Math.min(monthlyPayment * paidPeriods, Number(debt.amount || 0));
    const remainingAmount = Math.max(Number(debt.amount || 0) - paidAmount, 0);
    const progress = totalPeriods ? Math.round((paidPeriods / totalPeriods) * 100) : 0;

    return {
      totalPeriods,
      paidPeriods,
      monthlyPayment,
      paidAmount,
      remainingAmount,
      progress,
      extraStats: []
    };
  }

  if (debt.type === "creditRevolving") {
    const statementAmount = Number(debt.statementAmount || debt.currentPrincipal || debt.principal || 0);
    const annualRate = Number(debt.annualRate || 0);
    const interestDays = Number(debt.interestDays || debt.oldInterestDays || 30);
    const payment = Number(debt.monthlyPayment || 0);
    const linkedInfo = getLinkedCreditCardExpenseInfo(debt);

    const formula = calculateCreditRevolving({
      statementAmount,
      payment,
      annualRate,
      interestDays,
      linkedCreditExpense: linkedInfo.total
    });

    const progress = statementAmount > 0
      ? Math.min(Math.round((payment / statementAmount) * 100), 100)
      : 0;

    return {
      isRevolving: true,
      totalPeriods: null,
      paidPeriods: null,
      monthlyPayment: payment,
      paidAmount: payment,
      remainingAmount: formula.carryForward,
      currentRemaining: formula.currentRemaining,
      currentInterest: formula.currentInterest,
      statementAmount,
      progress,
      linkedSpending: linkedInfo.total,
      linkedRecordIds: linkedInfo.ids,
      extraStats: [
        { label: "信用卡支出連動", value: money(formula.linkedCreditExpense) },
        { label: "循環年利率", value: `${annualRate}%` },
        { label: "連動卡名", value: debt.linkedSubCategory || "信用卡支出" }
      ],
      note: "本期利息由含息帳單反推估算，只顯示不重複加進當期；信用卡支出只連動到卡循估算。"
    };
  }

  const result = calculateLoanProgress(
    Number(debt.principal || 0),
    Number(debt.annualRate || 0),
    Number(debt.monthlyPayment || 0),
    Number(debt.paidPeriods || 0)
  );

  return {
    totalPeriods: result.totalPeriods || 0,
    paidPeriods: result.paidPeriods || 0,
    monthlyPayment: Number(debt.monthlyPayment || 0),
    paidAmount: result.totalPaid || 0,
    remainingAmount: result.remainingPrincipal || 0,
    progress: result.progress || 0,
    extraStats: []
  };
}





























function getDebtMonthlyPayment(debt) {
  if (debt.type === "creditCard") {
    const detail = getDebtDetail(debt);
    return detail.paidPeriods >= detail.totalPeriods ? 0 : detail.monthlyPayment;
  }

  if (debt.type === "creditRevolving") {
    const detail = getDebtDetail(debt);
    return detail.remainingAmount <= 0 ? 0 : detail.monthlyPayment;
  }

  const detail = getDebtDetail(debt);
  return detail.paidPeriods >= detail.totalPeriods ? 0 : Number(debt.monthlyPayment || 0);
}

async function checkDebtPayment(id) {
  const debt = debts.find((item) => item.id === id);
  if (!debt) return;

  const detail = getDebtDetail(debt);

  if (debt.type === "creditRevolving") {
    const value = await customPrompt(
      "請輸入這期實際繳了多少錢",
      "當期已繳金額",
      String(Number(debt.monthlyPayment || 0) || "")
    );

    if (value === null) return;

    const payment = Number(value);

    if (Number.isNaN(payment) || payment < 0) {
      customAlert("請輸入正確的金額");
      return;
    }

    debt.monthlyPayment = payment;
    debt.totalPaid = Number(debt.totalPaid || 0) + payment;
    debt.lastPaidAt = new Date().toISOString();

    saveDebts();
    renderDebts();
    return;
  }

  if (detail.paidPeriods >= detail.totalPeriods) {
    customAlert("這個項目已經繳完了", "還款提醒");
    return;
  }

  debt.paidPeriods = Number(debt.paidPeriods || 0) + 1;
  saveDebts();
  renderDebts();
}









async function deleteDebt(id) {
  const confirmed = await customConfirm("確定要刪除這個還款項目嗎？", "刪除確認");

  if (!confirmed) return;

  debts = debts.filter((debt) => debt.id !== id);
  saveDebts();
  renderDebts();
}


function calculateCreditRevolving({ statementAmount, payment, annualRate, interestDays, linkedCreditExpense }) {
  const statement = Number(statementAmount || 0);
  const paid = Number(payment || 0);
  const rate = Number(annualRate || 0) / 100;
  const days = Number(interestDays || 0);
  const interestFactor = Math.max(rate, 0) / 365 * Math.max(days, 0);

  // 當期帳單金額視為「已經含本期循環利息」的金額。
  // 因此這裡用含息總額反推本期利息：利息 = 含息帳單 - 含息帳單 / (1 + 日利率 * 計息天數)。
  // 利息只負責顯示，不會再加進當期剩餘，避免重複計入。
  const currentInterestRaw = interestFactor > 0
    ? statement - (statement / (1 + interestFactor))
    : 0;

  const currentRemainingRaw = Math.max(statement - paid, 0);
  const linkedAmountRaw = Number(linkedCreditExpense || 0);
  const carryForwardRaw = currentRemainingRaw + linkedAmountRaw;

  return {
    currentRemaining: Math.round(currentRemainingRaw),
    currentInterest: Math.round(currentInterestRaw),
    linkedCreditExpense: Math.round(linkedAmountRaw),
    carryForward: Math.round(Math.max(carryForwardRaw, 0)),
    nextStatement: Math.round(Math.max(carryForwardRaw, 0))
  };
}



















function getLinkedCreditCardExpenseInfo(debt) {
  const cardName = debt.linkedSubCategory;

  if (!cardName) {
    return { total: 0, ids: [] };
  }

  const linkedRecords = records.filter((record) => {
    return (
      record.type === "expense" &&
      record.category === "信用卡支出" &&
      record.subCategory === cardName
    );
  });

  return {
    total: linkedRecords.reduce((sum, record) => sum + Number(record.amount || 0), 0),
    ids: linkedRecords.map((record) => record.id)
  };
}



function getLinkedCreditCardSpending(cardName) {
  if (!cardName) return 0;

  return records
    .filter((record) => {
      return (
        record.type === "expense" &&
        record.category === "信用卡支出" &&
        record.subCategory === cardName
      );
    })
    .reduce((sum, record) => sum + Number(record.amount || 0), 0);
}

function calculateLoanProgress(principal, annualRate, monthlyPayment, paidPeriods) {
  const monthlyRate = annualRate / 100 / 12;
  const safePaidPeriods = Math.max(0, Math.floor(Number(paidPeriods || 0)));

  if (monthlyRate > 0 && monthlyPayment <= principal * monthlyRate) {
    return {
      error: "每月還款金額不足以支付利息，請確認金額或利率。"
    };
  }

  let totalPeriods = 0;

  if (monthlyRate === 0) {
    totalPeriods = Math.ceil(principal / monthlyPayment);
  } else {
    totalPeriods = Math.ceil(
      -Math.log(1 - (principal * monthlyRate) / monthlyPayment) /
        Math.log(1 + monthlyRate)
    );
  }

  const paidPeriodsSafe = clampNumber(safePaidPeriods, 0, totalPeriods);
  const remainingPrincipal = calculateRemainingPrincipal(
    principal,
    monthlyRate,
    monthlyPayment,
    paidPeriodsSafe
  );

  const principalPaid = Math.max(principal - remainingPrincipal, 0);
  const totalPaid = monthlyPayment * paidPeriodsSafe;
  const estimatedInterestPaid = Math.max(totalPaid - principalPaid, 0);
  const progress = totalPeriods ? Math.round((paidPeriodsSafe / totalPeriods) * 100) : 0;

  return {
    totalPeriods,
    paidPeriods: paidPeriodsSafe,
    remainingPrincipal: Math.round(Math.max(remainingPrincipal, 0)),
    principalPaid: Math.round(principalPaid),
    totalPaid: Math.round(totalPaid),
    estimatedInterestPaid: Math.round(estimatedInterestPaid),
    progress: clampNumber(progress, 0, 100)
  };
}

function calculateRemainingPrincipal(principal, monthlyRate, monthlyPayment, paidPeriods) {
  if (paidPeriods <= 0) return principal;

  if (monthlyRate === 0) {
    return Math.max(principal - monthlyPayment * paidPeriods, 0);
  }

  const growth = Math.pow(1 + monthlyRate, paidPeriods);
  const remaining =
    principal * growth - monthlyPayment * ((growth - 1) / monthlyRate);

  return Math.max(remaining, 0);
}

function getDebtTypeLabel(type) {
  const labels = {
    creditCard: "信用卡分期",
    creditRevolving: "信用卡卡循",
    carLoan: "車貸",
    personalLoan: "信貸",
    otherLoan: "其他貸款"
  };

  return labels[type] || "還款項目";
}


function calculateRevolvingInterest(principal, annualRate, interestDays) {
  return Math.round(Number(principal || 0) * (Number(annualRate || 0) / 100) / 365 * Number(interestDays || 0));
}

function estimateRevolvingPeriods(balance, annualRate, interestDays, monthlyPayment) {
  let current = Number(balance || 0);
  const payment = Number(monthlyPayment || 0);
  const rate = Number(annualRate || 0);
  const days = Number(interestDays || 30);

  if (current <= 0) return 0;
  if (payment <= 0) return 0;

  let periods = 0;
  while (current > 0 && periods < 600) {
    const interest = calculateRevolvingInterest(current, rate, days);
    if (payment <= interest && current > 0) return 0;
    current = Math.max(current + interest - payment, 0);
    periods += 1;
  }

  return periods >= 600 ? 0 : periods;
}

function getLinkedCreditCardExpenseInfo(debt) {
  const cardName = debt.linkedSubCategory;
  const appliedIds = new Set(debt.appliedRecordIds || []);

  if (!cardName) {
    return { total: 0, ids: [] };
  }

  const linkedRecords = records.filter((record) => {
    return (
      record.type === "expense" &&
      record.category === "信用卡支出" &&
      record.subCategory === cardName &&
      !appliedIds.has(record.id)
    );
  });

  return {
    total: linkedRecords.reduce((sum, record) => sum + Number(record.amount || 0), 0),
    ids: linkedRecords.map((record) => record.id)
  };
}



function ensureCreditExpenseSubCategory(name) {
  const cleanName = String(name || "").trim();
  if (!cleanName) return;

  if (!folderCategories.expense["信用卡支出"]) {
    folderCategories.expense["信用卡支出"] = [];
  }

  if (!folderCategories.expense["信用卡支出"].includes(cleanName)) {
    folderCategories.expense["信用卡支出"].push(cleanName);
    folderCategories.expense["信用卡支出"].sort((a, b) => a.localeCompare(b, "zh-Hant"));
  }
}

function loadDebts() {
  try {
    const data = localStorage.getItem(DEBT_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}

function saveDebts() {
  localStorage.setItem(DEBT_STORAGE_KEY, JSON.stringify(debts));
}

function clampNumber(number, min, max) {
  return Math.min(Math.max(Number(number || 0), min), max);
}


function switchTab(tabName) {
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });

  tabPages.forEach((page) => {
    page.classList.toggle("active", page.dataset.tabPage === tabName);
  });

  if (tabName === "loan") {
    renderDebts();
    renderCreditCardDetails();
  }

  if (tabName === "stats") {
    render();
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (monthPickerOverlay && !monthPickerOverlay.hidden) {
      closeMonthPicker();
    }
    if (datePickerOverlay && !datePickerOverlay.hidden) {
      closeDatePicker();
    }
    if (customSelectOverlay && !customSelectOverlay.hidden) {
      closeCustomSelect();
    }
  }
});
