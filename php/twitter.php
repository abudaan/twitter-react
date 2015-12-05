<?php

require_once realpath(__DIR__ . '/..') . '/vendor/autoload.php';

use Abraham\TwitterOAuth\TwitterOAuth;

function get_tweets(){

  $twitter_customer_key           = 'BsbQVqVMgHSiTY56bACEBMvmJ';
  $twitter_customer_secret        = 'BBeiDrjE1m5jTXT9cg9PJloMlKE1k5HQZx7LVkWK1En2jw5AG0';
  $twitter_access_token           = '25058410-R1HUP9cxHFGJaZt1LTScrvDv1z6pEAwkEdeEX22It';
  $twitter_access_token_secret    = 'QKd9IfztgQ8WzYi7wTCdA268q6rzUwWti9NOBlNzrUZUt';

  $tweets = array();
  $tweets_per_page = 3;
  $save_path = '/home/abudaan/workspace/twitter-app/data';
  $connection = new TwitterOAuth($twitter_customer_key, $twitter_customer_secret, $twitter_access_token, $twitter_access_token_secret);

  $params = array(
    'screen_name' => 'ubuntu',
    'count' => 25,
    'include_rts' => true,
    'trim_user' => true
  );

  $raw_tweets = $connection->get('statuses/user_timeline', $params);

  $i = 0;
  $page = 0;
  $num_tweets = count($raw_tweets);
  error_log($num_tweets);

  foreach($raw_tweets as $tweet){
    $t = array(
      'id' => $tweet->id,
      'text' => parseTweet($tweet->text)
    );
    $tweets[] = $t;

    $i++;

    if($i == $tweets_per_page){
      $file = "$save_path/tweets_$page.json";
      $data = array('tweets' => $tweets);
      if($i === $num_tweets){
        $data['lastpage'] = true;
      }
      file_put_contents($file, json_encode($data));

      $i = 0;
      $page++;
      $tweets = array();
    }
  }

  if($i != 0){
    $data = array('tweets' => $tweets, 'lastpage' => true);
    $file = "$save_path/tweets_$page.json";
    file_put_contents($file, json_encode($data));
  }

  return $tweets;
}


function parseTweet($tweet){
  return $tweet;
}

?>

<?php
  echo json_encode(get_tweets());
?>