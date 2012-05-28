<?php
/**
 * Useful functions.  Should probably turn into a class file at some point.
 */

/**
 * This function is to be used when you have to include a file that renders HTML straight to the page
 * (like when you're using someone else's code and you can't refactor it for whatever reason...) and what 
 * you want is TOTAL! COMPLETE! CONTROL! of what gets output to the page, and when.  
 * 
 * basically, this function is used in place of include().
 */
function get_include_contents($filename) {
    if (is_file($filename)) {
        ob_start();
        include $filename;
        $contents = ob_get_contents();
        ob_end_clean();
        return $contents;
    }
    return false;
}

/**
 * I would like a more useful var_dump to live here.
 * 
 * It should be like the showDebugInfo() at WSOD in that it would appear as a closed div at the top of the page,
 * until you click on it and it expands.  That would be coooooool.
 */

/**
 * Need a utility function to do what ucwords() should be doing - allowing the user to
 * selectively capitalize words in a string, leaving alone words like
 * 'the', 'in', 'of' and 'and' if they are not the first word.
 * 
 * Maybe have a 'commonsense' parameter to turn this on? or call it 'selective'?
 * Maybe provide an array of words to leave alone - if this array is not provided, 
 * the selectivity will default to the above list
 */
?>