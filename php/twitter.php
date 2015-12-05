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
  $twitter_user = 'ubuntu';
  $save_path = '/home/abudaan/workspace/twitter-app/data';
  $connection = new TwitterOAuth($twitter_customer_key, $twitter_customer_secret, $twitter_access_token, $twitter_access_token_secret);

  $params = array(
    'screen_name' => $twitter_user,
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
      'text' => parse_tweet($tweet->text)
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


function parse_tweet($tweet){
  $pattern = '#(@|\#)([a-zA-Z0-9_]+)#';
  preg_match_all($pattern, $tweet, $matches, PREG_SET_ORDER);

  if($matches){
    foreach($matches as $match){
      if($match[1] == '@'){
        $user = $match[2];
        $link = "<a href=\"https://twitter.com/$user\">@$user</a>";
        $tweet = str_replace("@$user", $link, $tweet);
      }else if($match[1] == '#'){
        $hash = $match[2];
        $link = "<a href=\"https://twitter.com/hashtag/$hash?src=hash\">#$hash</a>";
        $tweet = str_replace("#$hash", $link, $tweet);
      }
    }
  }

  return $tweet;
}

  //echo json_encode(get_tweets());
  //echo parse_tweet('RT @MignonDelicia: Here is how our @Fontys School of #Communication students give shape to #thoughtleadership: https://t.co/mMqqMxauOr @DST\u2026');
  get_tweets();
  echo 'done';

?>