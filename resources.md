USE CSS VARIABLES IN JAVASCRIPT
    const rootStyles = getComputedStyle(document.documentElement);
    const happyColor = rootStyles.getPropertyValue('--happy').trim();
    console.log(happyColor); // "#88FF88"
