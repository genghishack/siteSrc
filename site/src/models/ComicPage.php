<?php 
class ComicPage extends ActiveRecord\Model
{
	static function getFirstAndLast()
	{
		return self::find('first', array(
			'select' => 'MIN(sequence) as first, MAX(sequence) as last'
		));
	}
	
	static function getComicBySequence($nSequenceID)
	{
		return self::find('first', array(
			'conditions' => array('sequence = ?', $nSequenceID)
		));
	}
	
	static function getPagedResult($page=1, $pageSize=5, $sortDir='asc', $sortBy='sequence')
	{
		$page = ($page < 1) ? 1 : $page;
		
		$oCount = self::find('all', array('select' => 'count(*) as count'));		
		$totalCount = $oCount[0]->count;
		$totalPages = ceil($totalCount / $pageSize);

		if ($sortDir != 'desc') { $sortDir = 'asc'; }
		
		$options = array(
			 'order' => "$sortBy $sortDir"
			,'limit' => $pageSize
			,'offset' => $pageSize * ($page-1)
		);
		
		$list = self::find('all', $options);
		
		return array(
			 'Page' => $page
			,'PageSize' => $pageSize
			,'TotalPages' => $totalPages
			,'TotalCount' => $totalCount
			,'List' => $list
		);
	}

	static function getFileNames()
	{
		$result = self::find('all', array('select' => 'filename'));
		
		$returnArray = array();
		
		foreach ($result as $row) {
			array_push($returnArray, $row->filename);
		}
		
		return $returnArray;
	}
	
	public function updateSequence($value)
	{
		$oCount = self::find('all', array('select' => 'count(*) as count'));
		$nCount = $oCount[0]->count;
		
		$oldPosition = $this->sequence;
		$newPosition = floor($value);
		
		if ($newPosition < 1 || $newPosition > $nCount || $newPosition == $oldPosition) {
			return;
		}
		
		if ($newPosition < $oldPosition) {
			$recordsToModify = self::find('all', array(
				'conditions' => "sequence >= $newPosition AND sequence < $oldPosition"
			));
			foreach ($recordsToModify as $record)
			{
				$record->sequence = $record->sequence + 1;
				$record->save();
			}
		} else {
			$recordsToModify = self::find('all', array(
				'conditions' => "sequence <= $newPosition AND sequence > $oldPosition"
			));
			foreach ($recordsToModify as $record)
			{
				$record->sequence = $record->sequence - 1;
				$record->save();
			}
		}
		
		$this->sequence = $newPosition;
		$this->save();
	}
	
	public function deleteRow()
	{
		$oCount = self::find('all', array('select' => 'count(*) as count'));
		$nCount = $oCount[0]->count;
		
		$position = $this->sequence;
		$recordsToModify = self::find('all', array(
			'conditions' => "sequence <= $nCount AND sequence > $position"
		));
		foreach ($recordsToModify as $record)
		{
			$record->sequence = $record->sequence - 1;
			$record->save();
		}
		
		$this->delete();
	}
}
?>