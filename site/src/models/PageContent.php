<?php 
class PageContent extends ActiveRecord\Model
{
	static function getContentByPageName($sPageName)
	{
		return self::find('first', array(
			'conditions' => array('pagename = ?', $sPageName)
		));
	}
}
?>