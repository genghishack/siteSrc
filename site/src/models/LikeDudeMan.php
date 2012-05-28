<?php 
class LikeDudeMan extends ComicPage
{
	static $table_name = 'likedudeman';

	static function createNewRecord($filename, $date_drawn, $caption='')
	{
		$oSequence = self::find('all', array('select' => 'max(sequence) as sequence'));
		$maxSequence = $oSequence[0]->sequence;
		
		$record = new self();
		$record->filename = $filename;
		$record->date_drawn = $date_drawn;
		$record->caption_text = $caption;
		$record->sequence = $maxSequence + 1;
		
		$record->save();
	}
	
}
?>