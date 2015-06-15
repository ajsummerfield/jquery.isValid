# jQuery.isValid #

jQuery.isValid is a form validation plugin that includes multiple types of error checking, customisation of error messages and how/when they are shown. 

## Get Started ##
<br/>
To use jQuery.isValid, make sure you have jQuery and then add the following markup to your html:

    <!-- Styles -->   
    <link type="text/css" href="css/jquery.isValid.css" rel="stylesheet" />
    
    <!-- Scripts -->   
    <script type="text/javascript" src="/js/checkPostCode.js"></script>
    <script type="text/javascript" src="/js/moment.js"></script>
    <script type="text/javascript" src="/js/jquery.isValid.js"></script>
    
There is a dependency on moment.js and the checkPostCode is 1 function just split out ito a single file. Credit to John Gardner for this.

## How it works ##
<br/>


## Options ##
<br/>
The majority of the options in the plugin are various different types of field that each consist of their own validators. However there are also some other core options for further control over each aspect of the plugin.

### **general** ###
**Type:** Object
<br/><br/>
**Properties:**

- activeErrorMessage
    - The currently active error message being displayed
- requiredErrorMessage
    - The error message to display if the field is required
- callbacks
    - onValidated
        - Callback that triggers when the field is validated
    - onInvalidated
        - Callback that triggers when the field is validated

## Browser Support ##
<br />
Tested in:

- IE8 and above
- Firefox
- Chrome (Android and Desktop)
- Safari (iOS and Desktop)

It could well work in other browsers, but I just haven't tested in every single one.