<?php

include_once('twitteroauth/twitteroauth.php');

function get_tweets(){

  $twitter_customer_key           = 'BsbQVqVMgHSiTY56bACEBMvmJ';
  $twitter_customer_secret        = 'BBeiDrjE1m5jTXT9cg9PJloMlKE1k5HQZx7LVkWK1En2jw5AG0';
  $twitter_access_token           = '25058410-R1HUP9cxHFGJaZt1LTScrvDv1z6pEAwkEdeEX22It';
  $twitter_access_token_secret    = 'QKd9IfztgQ8WzYi7wTCdA268q6rzUwWti9NOBlNzrUZUt';

  $tweets = array();
  $connection = new TwitterOAuth($twitter_customer_key, $twitter_customer_secret, $twitter_access_token, $twitter_access_token_secret);

  $params = array(
    'screen_name' => 'ubuntu',
    'count' => 3,
    'include_rts' => true,
    'trim_user' => true
  );

  $raw_tweets = $connection->get('statuses/user_timeline', $params);

  file_put_contents('/home/abudaan/workspace/twitter-app/data/tweets.json', json_encode($tweets));

  foreach($raw_tweets as $tweet){
    $t = array(
      'id' => $tweet->id,
      'text' => $tweet->text
    );
    $tweets[] = $t;
  }


  if(isset($tweets->errors)){
    $my_tweets->statuses = array(
      new stdObject(
        array('text' => $my_tweets->errors[0]->code . ' - '. $my_tweets->errors[0]->message)
      )
    );
    $tweets = array('error' => 'Something went wrong');
  }

  return $tweets;
}
?>

<?php

  echo json_encode(get_tweets());

?>