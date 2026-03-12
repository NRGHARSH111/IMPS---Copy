// Debug script to help identify validation issues
// Copy this code to browser console when the form is filled but validation fails

// Function to check form state manually
function debugFormState() {
  // Get the form element
  const form = document.querySelector('form');
  if (!form) {
    console.log('❌ No form found');
    return;
  }

  // Get all input fields
  const inputs = {
    branch: form.querySelector('[name="branch"]'),
    orgElementCode: form.querySelector('[name="orgElementCode"]'),
    accountHeadCode: form.querySelector('[name="accountHeadCode"]'),
    accountNo: form.querySelector('[name="accountNo"]'),
    remitterMmid: form.querySelector('[name="remitterMmid"]'),
    remitterMobile: form.querySelector('[name="remitterMobile"]'),
    transactionAmount: form.querySelector('[name="transactionAmount"]'),
    beneficiaryIfscCode: form.querySelector('[name="beneficiaryIfscCode"]'),
    beneficiaryMmid: form.querySelector('[name="beneficiaryMmid"]'),
    beneficiaryMobileNo: form.querySelector('[name="beneficiaryMobileNo"]')
  };

  console.log('🔍 DEBUGGING FORM STATE:');
  console.log('==========================');

  // Check each field
  Object.entries(inputs).forEach(([fieldName, element]) => {
    if (!element) {
      console.log(`❌ ${fieldName}: Element not found`);
      return;
    }

    const value = element.value || '';
    const trimmed = value.toString().trim();
    const isEmpty = !value || trimmed === '';
    const type = element.type || 'text';
    
    console.log(`${fieldName}:`, {
      element: element.tagName + (element.name ? `[name="${element.name}"]` : ''),
      value: `"${value}"`,
      trimmed: `"${trimmed}"`,
      isEmpty: isEmpty,
      type: type,
      length: value.length,
      visible: element.offsetParent !== null
    });
  });

  console.log('==========================');
  console.log('📝 Manual validation check:');

  // Manual validation check
  const errors = [];
  
  if (!inputs.branch?.value?.trim()) errors.push('Branch');
  if (!inputs.orgElementCode?.value?.trim()) errors.push('Account Part 1');
  if (!inputs.accountHeadCode?.value?.trim()) errors.push('Account Part 2');
  if (!inputs.accountNo?.value?.trim()) errors.push('Account Part 3');
  if (!inputs.remitterMmid?.value?.trim()) errors.push('Remitter MMID');
  if (!inputs.remitterMobile?.value?.trim()) errors.push('Remitter Mobile');
  if (!inputs.transactionAmount?.value?.trim()) errors.push('Transaction Amount');
  if (!inputs.beneficiaryIfscCode?.value?.trim()) errors.push('Beneficiary IFSC');
  if (!inputs.beneficiaryMmid?.value?.trim()) errors.push('Beneficiary MMID');
  if (!inputs.beneficiaryMobileNo?.value?.trim()) errors.push('Beneficiary Mobile');

  if (errors.length > 0) {
    console.log('❌ VALIDATION ERRORS:', errors);
    console.log(`🚨 Error message would be: "Validation Error: ${errors.join(', ')} is missing"`);
  } else {
    console.log('✅ ALL FIELDS PASS MANUAL VALIDATION');
  }

  // Check React state (if accessible)
  console.log('🔍 Checking React state...');
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('React DevTools available - check Components tab for formData state');
  }
}

// Auto-run debug function
console.log('🚀 Validation Debug Script Loaded');
console.log('📝 Run debugFormState() in console to debug form validation');

// Make function globally available
window.debugFormState = debugFormState;
