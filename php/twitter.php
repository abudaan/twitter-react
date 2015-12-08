<?php

/*
  cronjob:
    wget -q -O- http://abumarkub.net/twitter/php/twitter.php
    wget -q -O- http://abumarkub.net/twitter/php/twitter.php >/dev/null 2>&1
*/


require_once realpath(__DIR__ . '/..') . '/vendor/autoload.php';

use Abraham\TwitterOAuth\TwitterOAuth;

class Tweets{

  const twitter_customer_key           = 'BsbQVqVMgHSiTY56bACEBMvmJ';
  const twitter_customer_secret        = 'BBeiDrjE1m5jTXT9cg9PJloMlKE1k5HQZx7LVkWK1En2jw5AG0';
  const twitter_access_token           = '25058410-R1HUP9cxHFGJaZt1LTScrvDv1z6pEAwkEdeEX22It';
  const twitter_access_token_secret    = 'QKd9IfztgQ8WzYi7wTCdA268q6rzUwWti9NOBlNzrUZUt';

  const tweets_per_page                = 3;
  const count_tweets                   = 200; // max number of tweets that can be retrieved per request
  const twitter_user                   = 'DST_Fontys';
  //const save_path                      = '/home/abumarku/www/twitter/data';
  //const file_all_tweets                = '/home/abumarku/www/twitter/data/all_tweets.json'; // use this if you are using php < 5.6
  const save_path                      = '/home/abudaan/workspace/twitter-app/data';
  const file_all_tweets                = self::save_path . '/all_tweets.json';
  const last_tweet_id                  = 0;
  const months                         = array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
  const days                           = array('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');


  function __construct(){
    $this->paginate($this->get_tweets());
    //$this->get_unix_date();
  }


  function get_tweets(){
    echo "get_tweets<br>";

    $connection = new TwitterOAuth(self::twitter_customer_key, self::twitter_customer_secret, self::twitter_access_token, self::twitter_access_token_secret);

    $params = array(
      'screen_name' => self::twitter_user,
      'count' => self::count_tweets,
      'include_rts' => true,
      'trim_user' => false
    );

    $data = array(
      'tweets' => array()
    );
    $new_tweets = array();
    $old_tweets = array();

    if(file_exists(self::file_all_tweets)){
      $data = json_decode(file_get_contents(self::file_all_tweets), true);
      $params['since_id'] = $data['last_tweet_id'];
      $old_tweets = $data['tweets'];
    }

    $tweets = $connection->get('statuses/user_timeline', $params);
    $num_tweets = count($tweets);

    echo "got " . $num_tweets . " new tweets<br>";

    // for debugging
    file_put_contents(self::save_path . '/sample.json', json_encode($tweets));

    if($num_tweets > 0){

      foreach($tweets as $tweet){
        //echo " -> $tweet->text<br>";
        $new_tweets[] = $this->parse_tweet($tweet);
      }

      $data['last_tweet_id'] = $new_tweets[0]['id'];
      $data['tweets'] = array_merge($new_tweets, $old_tweets);
      file_put_contents(self::file_all_tweets, json_encode($data));
    }
    return $data['tweets'];
  }


  function paginate($tweets){
    echo "paginate<br>";

    $i = 0;
    $page = 0;
    $tweets_on_page = array();
    $num_tweets = count($tweets);

    foreach($tweets as $tweet){
      $tweets_on_page[] = $tweet;
      $i++;
      if($i == self::tweets_per_page){
        $file = self::save_path . "/tweets_$page.json";
        $data = array('tweets' => $tweets_on_page);
        if($i === $num_tweets){
          $data['lastpage'] = true;
        }
        file_put_contents($file, json_encode($data));

        $i = 0;
        $page++;
        $tweets_on_page = array();
      }
    }

    if($i != 0){
      $data = array('tweets' => $tweets_on_page, 'lastpage' => true);
      $file = self::save_path . "/tweets_$page.json";
      file_put_contents($file, json_encode($data));
    }

    return true;
  }


  function parse_tweet($tweet){

    $id = $tweet->id_str;
    $text = $tweet->text;
    //$user_id = $tweet->user->id;
    $user_name = $tweet->user->screen_name;
    $user_img = $tweet->user->profile_image_url;
    $time = $tweet->created_at;
    $tco_url = '0';
    $media_url = '0';
    $has_media = false;
    $retweet = substr($text, 0, 2) === 'RT';

    if(count($tweet->entities->media) > 0){
      if($tweet->entities->media[0]->type == 'photo'){
        $media_url = $tweet->entities->media[0]->media_url;
        $tco_url = $tweet->entities->media[0]->url;
        $has_media = true;
      }
    }

    if($retweet){
      //$user_id = $tweet->retweeted_status->user->id;
      $text = $tweet->retweeted_status->text;
      $user_name = $tweet->retweeted_status->user->screen_name;
      $user_img = $tweet->retweeted_status->user->profile_image_url;
      $time = $tweet->retweeted_status->created_at;
      if(count($tweet->retweeted_status->entities->media) > 0){
        if($tweet->retweeted_status->entities->media[0]->type == 'photo'){
          $media_url = $tweet->retweeted_status->entities->media[0]->media_url;
          $tco_url = $tweet->retweeted_status->entities->media[0]->url;
          $has_media = true;
        }
      }
    }


    // convert urls to a hrefs
    $pattern = '#(http)(s)?(:\/\/)([^\s]*)#';
    preg_match_all($pattern, $text, $matches, PREG_SET_ORDER);

    if($matches){
      foreach($matches as $match){
        $url = $match[1] . $match[2] . $match[3] . $match[4];
        if($url === $tco_url){
          // remove the link to media: we'll add it to the json object, see below
          $link = "";
        }else{
          $link = "<a class=\"url\" target=\"blank\" href=\"$url\">$url</a>";
        }
        $text = str_replace($url, $link, $text);
      }
    }


    // convert user name and hash to hrefs
    $pattern = '#(\s)(@|\#)([a-zA-Z0-9_]+)#';
    preg_match_all($pattern, $text, $matches, PREG_SET_ORDER);

    if($matches){
      foreach($matches as $match){
        if($match[2] == '@'){
          $user = $match[3];
          $link = "<a class=\"user\" target=\"blank\" href=\"https://twitter.com/$user\">@$user</a>";
          $text = str_replace("@$user", $link, $text);
        }else if($match[2] == '#'){
          $hash = $match[3];
          $link = "<a class=\"hash\" target=\"blank\" href=\"https://twitter.com/hashtag/$hash?src=hash\">#$hash</a>";
          $text = str_replace("#$hash", $link, $text);
        }
      }
    }

    $data = array(
      'id' => $id,
      'user_name' => $user_name,
      'user_img' => $user_img,
      'text' => $text,
      'time' => $this->get_unix_date($time)
    );

    // add media urls separately so we can format them in a more flexible way (currently only the first photo is added)
    if($has_media){
      $data['media_url'] = $media_url;
    }

    if($retweet){
      $data['retweet'] = $retweet;
    }

    return $data;
  }

  function get_unix_date($date){
    //$date = "Wed Nov 25 08:06:30 +0000 2015";
    echo $date . '<br>';
    $date = explode(' ', $date);

    $dst = $date[4] == '+0000' ? -1 : 1;

    $day = $date[2];
    $month = $this->get_month($date[1]);
    $year = $date[5];


    $time = explode(':', $date[3]);
    $hour = $this->get_number($time[0]);
    $minute = $this->get_number($time[1]);
    $second = $this->get_number($time[2]);

    $unix = mktime($hour, $minute, $second, $month, $day, $year);

    // echo "$day<br>";
    // echo "$month<br>";
    // echo "$year<br>";
    // echo "$dst<br>";
    // echo "$hour<br>";
    // echo "$minute<br>";
    // echo "$second<br>";
    // echo "$unix<br>";
    echo '---> ' . date('c', mktime($hour, $minute, $second, $month, $day, $year)) . '<br>';
    return $unix;
  }

  function get_month($m){
    $i = 0;
    foreach(self::months as $month){
      //echo $m . ' ' . $month . '<br>';
      if($m == $month){
        return $i;
      }
      $i++;
    }
  }

  function get_number($n){
    if(strpos($n, '0') == 0){
      $n = str_replace('0', '', $n);
    }
    //echo $n . '<br>';
    return intval($n);
  }
}


// start

new Tweets();
echo 'done';

?>