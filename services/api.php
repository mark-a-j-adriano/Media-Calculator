<?php
     require_once("Rest.inc.php");

    class API extends REST {

        public $data = "";

        const DB_SERVER = "127.0.0.1";
        const DB_USER = "root";
        const DB_PASSWORD = "";
        const DB = "angularcode_customer";

        private $db = NULL;
        private $mysqli = NULL;
        public function __construct(){
            parent::__construct();				// Init parent contructor
            $this->dbConnect();					// Initiate Database connection
        }
        /*
         *  Connect to Database
        */
        private function dbConnect(){
            $this->mysqli = new mysqli(self::DB_SERVER, self::DB_USER, self::DB_PASSWORD, self::DB);
        }
        /*
         * Dynmically call the method based on the query string
         */
        public function processApi(){
            $func = strtolower(trim(str_replace("/","",$_REQUEST['x'])));
            if((int)method_exists($this,$func) > 0)
                $this->$func();
            else
                $this->response('',404); // If the method not exist with in this class "Page not found".
        }
        private function login(){
            if($this->get_request_method() != "POST"){
                $this->response('',406);
            }
            $email = $this->_request['email'];
            $password = $this->_request['pwd'];
            if(!empty($email) and !empty($password)){
                if(filter_var($email, FILTER_VALIDATE_EMAIL)){
                    $query="SELECT uid, name, email FROM users WHERE email = '$email' AND password = '".md5($password)."' LIMIT 1";
                    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

                    if($r->num_rows > 0) {
                        $result = $r->fetch_assoc();
                        // If success everythig is good send header as "OK" and user details
                        $this->response($this->json($result), 200);
                    }
                    $this->response('', 204);	// If no records "No Content" status
                }
            }

            $error = array('status' => "Failed", "msg" => "Invalid Email address or Password");
            $this->response($this->json($error), 400);
        }
        private function customers(){
            if($this->get_request_method() != "GET"){
                $this->response('',406);
            }
            $query="SELECT distinct c.customerNumber, c.customerName, c.email, c.address, c.city, c.state, c.postalCode, c.country FROM angularcode_customers c order by c.customerNumber desc";
            $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

            if($r->num_rows > 0){
                $result = array();
                while($row = $r->fetch_assoc()){
                    $result[] = $row;
                }
                $this->response($this->json($result), 200); // send user details
            }
            $this->response('',204);	// If no records "No Content" status
        }
        private function customer(){
            if($this->get_request_method() != "GET"){
                $this->response('',406);
            }
            $id = (int)$this->_request['id'];
            if($id > 0){
                $query="SELECT distinct c.customerNumber, c.customerName, c.email, c.address, c.city, c.state, c.postalCode, c.country FROM angularcode_customers c where c.customerNumber=$id";
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                if($r->num_rows > 0) {
                    $result = $r->fetch_assoc();
                    $this->response($this->json($result), 200); // send user details
                }
            }
            $this->response('',204);	// If no records "No Content" status
        }
        private function insertCustomer(){
            if($this->get_request_method() != "POST"){
                $this->response('',406);
            }

            $customer = json_decode(file_get_contents("php://input"),true);
            $column_names = array('customerName', 'email', 'city', 'address', 'country');
            $keys = array_keys($customer);
            $columns = '';
            $values = '';
            foreach($column_names as $desired_key){ // Check the customer received. If blank insert blank into the array.
               if(!in_array($desired_key, $keys)) {
                       $$desired_key = '';
                }else{
                    $$desired_key = $customer[$desired_key];
                }
                $columns = $columns.$desired_key.',';
                $values = $values."'".$$desired_key."',";
            }
            $query = "INSERT INTO angularcode_customers(".trim($columns,',').") VALUES(".trim($values,',').")";
            if(!empty($customer)){
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                $success = array('status' => "Success", "msg" => "Customer Created Successfully.", "data" => $customer);
                $this->response($this->json($success),200);
            }else
                $this->response('',204);	//"No Content" status
        }
        private function updateCustomer(){
            if($this->get_request_method() != "POST"){
                $this->response('',406);
            }
            $customer = json_decode(file_get_contents("php://input"),true);
            $id = (int)$customer['id'];
            $column_names = array('customerName', 'email', 'city', 'address', 'country');
            $keys = array_keys($customer['customer']);
            $columns = '';
            $values = '';
            foreach($column_names as $desired_key){ // Check the customer received. If key does not exist, insert blank into the array.
               if(!in_array($desired_key, $keys)) {
                       $$desired_key = '';
                }else{
                    $$desired_key = $customer['customer'][$desired_key];
                }
                $columns = $columns.$desired_key."='".$$desired_key."',";
            }
            $query = "UPDATE angularcode_customers SET ".trim($columns,',')." WHERE customerNumber=$id";
            if(!empty($customer)){
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                $success = array('status' => "Success", "msg" => "Customer ".$id." Updated Successfully.", "data" => $customer);
                $this->response($this->json($success),200);
            }else
                $this->response('',204);	// "No Content" status
        }
        private function deleteCustomer(){
            if($this->get_request_method() != "DELETE"){
                $this->response('',406);
            }
            $id = (int)$this->_request['id'];
            if($id > 0){
                $query="DELETE FROM angularcode_customers WHERE customerNumber = $id";
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                $success = array('status' => "Success", "msg" => "Successfully deleted one record.");
                $this->response($this->json($success),200);
            }else
                $this->response('',204);	// If no records "No Content" status
        }
        private function nielsenDatas(){
            if($this->get_request_method() != "GET"){
                $this->response('',406);
            }
            $query="SELECT distinct c.ID, c.Media, c.Type, c.Target1, c.Target2, c.Target3, c.Target4, c.Target5, c.Target6, c.Target7, c.Target8, c.Target9, c.Target10 FROM angularcode_nielsenDatas c order by c.Type desc";
            $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

            if($r->num_rows > 0){
                $result = array();
                while($row = $r->fetch_assoc()){
                    $result[] = $row;
                }
                $this->response($this->json($result), 200); // send user details
            }
            $this->response('',204);	// If no records "No Content" status
        }
        private function nielsenData(){
            if($this->get_request_method() != "GET"){
                $this->response('',406);
            }
            $id = (int)$this->_request['id'];
            if($id > 0){
                $query="SELECT distinct c.ID, c.Media, c.Type, c.Target1, c.Target2, c.Target3, c.Target4, c.Target5, c.Target6, c.Target7, c.Target8, c.Target9, c.Target10 FROM angularcode_nielsenDatas c where c.ID=$id";
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                if($r->num_rows > 0) {
                    $result = $r->fetch_assoc();
                    $this->response($this->json($result), 200); // send user details
                }
            }
            $this->response('',204);	// If no records "No Content" status
        }
        private function insertNielsenData(){
            if($this->get_request_method() != "POST"){
                $this->response('',406);
            }

            $nielsenData = json_decode(file_get_contents("php://input"),true);
            $column_names = array('Media', 'Type', 'Target1', 'Target2', 'Target3', 'Target4', 'Target5', 'Target6', 'Target7', 'Target8', 'Target9', 'Target10');
            $keys = array_keys($nielsenData);
            $columns = '';
            $values = '';
            foreach($column_names as $desired_key){ // Check the nielsenData received. If blank insert blank into the array.
               if(!in_array($desired_key, $keys)) {
                       $$desired_key = '';
                }else{
                    $$desired_key = $nielsenData[$desired_key];
                }
                $columns = $columns.$desired_key.',';
                $values = $values."'".$$desired_key."',";
            }
            $query = "INSERT INTO angularcode_nielsenDatas(".trim($columns,',').") VALUES(".trim($values,',').")";
            if(!empty($nielsenData)){
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                $success = array('status' => "Success", "msg" => "NielsenData Created Successfully.", "data" => $nielsenData);
                $this->response($this->json($success),200);
            }else
                $this->response('',204);	//"No Content" status
        }
        private function updateNielsenData(){
            if($this->get_request_method() != "POST"){
                $this->response('',406);
            }
            $nielsenData = json_decode(file_get_contents("php://input"),true);
            $id = (int)$nielsenData['id'];
            $column_names = array('Media', 'Type', 'Target1', 'Target2', 'Target3', 'Target4', 'Target5', 'Target6', 'Target7', 'Target8', 'Target9', 'Target10');
            $keys = array_keys($nielsenData['nielsenData']);
            $columns = '';
            $values = '';
            foreach($column_names as $desired_key){ // Check the nielsenData received. If key does not exist, insert blank into the array.
               if(!in_array($desired_key, $keys)) {
                       $$desired_key = '';
                }else{
                    $$desired_key = $nielsenData['nielsenData'][$desired_key];
                }
                $columns = $columns.$desired_key."='".$$desired_key."',";
            }
            $query = "UPDATE angularcode_nielsenDatas SET ".trim($columns,',')." WHERE ID=$id";
            if(!empty($nielsenData)){
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                $success = array('status' => "Success", "msg" => "NielsenData ".$id." Updated Successfully.", "data" => $nielsenData);
                $this->response($this->json($success),200);
            }else
                $this->response('',204);	// "No Content" status
        }
        private function deleteNielsenData(){
            if($this->get_request_method() != "DELETE"){
                $this->response('',406);
            }
            $id = (int)$this->_request['id'];
            if($id > 0){
                $query="DELETE FROM angularcode_nielsenDatas WHERE ID = $id";
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                $success = array('status' => "Success", "msg" => "Successfully deleted one record.");
                $this->response($this->json($success),200);
            }else
                $this->response('',204);	// If no records "No Content" status
        }
        private function targetDatas(){
            if($this->get_request_method() != "GET"){
                $this->response('',406);
            }
            $query="SELECT distinct c.ID, c.Name FROM angularcode_targetDatas c order by c.ID desc";
            $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

            if($r->num_rows > 0){
                $result = array();
                while($row = $r->fetch_assoc()){
                    $result[] = $row;
                }
                $this->response($this->json($result), 200); // send user details
            }
            $this->response('',204);	// If no records "No Content" status
        }
        private function targetData(){
            if($this->get_request_method() != "GET"){
                $this->response('',406);
            }
            $id = (int)$this->_request['id'];
            if($id > 0){
                $query="SELECT distinct c.ID, c.Name FROM angularcode_targetDatas c where c.ID=$id";
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                if($r->num_rows > 0) {
                    $result = $r->fetch_assoc();
                    $this->response($this->json($result), 200); // send user details
                }
            }
            $this->response('',204);	// If no records "No Content" status
        }
        private function insertTargetData(){
            if($this->get_request_method() != "POST"){
                $this->response('',406);
            }

            $targetData = json_decode(file_get_contents("php://input"),true);
            $column_names = array('Name');
            $keys = array_keys($targetData);
            $columns = '';
            $values = '';
            foreach($column_names as $desired_key){ // Check the targetData received. If blank insert blank into the array.
               if(!in_array($desired_key, $keys)) {
                       $$desired_key = '';
                }else{
                    $$desired_key = $targetData[$desired_key];
                }
                $columns = $columns.$desired_key.',';
                $values = $values."'".$$desired_key."',";
            }
            $query = "INSERT INTO angularcode_targetDatas(".trim($columns,',').") VALUES(".trim($values,',').")";
            if(!empty($targetData)){
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                $success = array('status' => "Success", "msg" => "TargetData Created Successfully.", "data" => $targetData);
                $this->response($this->json($success),200);
            }else
                $this->response('',204);	//"No Content" status
        }
        private function updateTargetData(){
            if($this->get_request_method() != "POST"){
                $this->response('',406);
            }
            $targetData = json_decode(file_get_contents("php://input"),true);
            $id = (int)$targetData['id'];
            $column_names = array('Name');
            $keys = array_keys($targetData['targetData']);
            $columns = '';
            $values = '';
            foreach($column_names as $desired_key){ // Check the targetData received. If key does not exist, insert blank into the array.
               if(!in_array($desired_key, $keys)) {
                       $$desired_key = '';
                }else{
                    $$desired_key = $targetData['targetData'][$desired_key];
                }
                $columns = $columns.$desired_key."='".$$desired_key."',";
            }
            $query = "UPDATE angularcode_targetDatas SET ".trim($columns,',')." WHERE ID=$id";
            if(!empty($targetData)){
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                $success = array('status' => "Success", "msg" => "TargetData ".$id." Updated Successfully.", "data" => $targetData);
                $this->response($this->json($success),200);
            }else
                $this->response('',204);	// "No Content" status
        }
        private function deleteTargetData(){
            if($this->get_request_method() != "DELETE"){
                $this->response('',406);
            }
            $id = (int)$this->_request['id'];
            if($id > 0){
                $query="DELETE FROM angularcode_targetDatas WHERE ID = $id";
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                $success = array('status' => "Success", "msg" => "Successfully deleted one record.");
                $this->response($this->json($success),200);
            }else
                $this->response('',204);	// If no records "No Content" status
        }
        private function getData(){

            if($this->get_request_method() != "GET"){
                $this->response('',406);
            }

            /*
                if($_GET["a"] === "") echo "a is an empty string\n";
                if($_GET["a"] === false) echo "a is false\n";
                if($_GET["a"] === null) echo "a is null\n";
                if(isset($_GET["a"])) echo "a is set\n";
                if(!empty($_GET["a"])) echo "a is not empty";
            */

            $id = (int)$this->_request['id'];
            $type = $this->_request['typ'];
            if($id > 0){

                $query="SELECT Media, Target$id AS Target FROM angularcode_nielsenDatas WHERE Type='$type' ORDER BY Media ASC";
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

                if($r->num_rows > 0){
                    $result = array();
                    while($row = $r->fetch_assoc()){
                        $result[] = $row;
                    }
                    $this->response($this->json($result), 200); // send user details
                }
            }
            $this->response('',204);	// If no records "No Content" status
        }
        private function getMediaTitle(){

            if($this->get_request_method() != "GET"){
                $this->response('',406);
            }

            /*
                if($_GET["a"] === "") echo "a is an empty string\n";
                if($_GET["a"] === false) echo "a is false\n";
                if($_GET["a"] === null) echo "a is null\n";
                if(isset($_GET["a"])) echo "a is set\n";
                if(!empty($_GET["a"])) echo "a is not empty";
            */

            $id = (int)$this->_request['id'];
            $type = $this->_request['typ'];
            if($id > 0){

                $query="SELECT Media FROM angularcode_nielsenDatas WHERE Type='$type' ORDER BY Media ASC";
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

                if($r->num_rows > 0){
                    $result = array();
                    while($row = $r->fetch_assoc()){
                        $result[] = $row;
                    }
                    $this->response($this->json($result), 200); // send user details
                }
            }
            $this->response('',204);	// If no records "No Content" status
        }
        private function getMediaData(){

            if($this->get_request_method() != "GET"){
                $this->response('',406);
            }

            /*
                if($_GET["a"] === "") echo "a is an empty string\n";
                if($_GET["a"] === false) echo "a is false\n";
                if($_GET["a"] === null) echo "a is null\n";
                if(isset($_GET["a"])) echo "a is set\n";
                if(!empty($_GET["a"])) echo "a is not empty";
            */

            $id = (int)$this->_request['id'];
            $type = $this->_request['typ'];
            if($id > 0){

                $query="SELECT Target$id FROM angularcode_nielsenDatas WHERE Type='$type'  ORDER BY Media ASC";
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

                if($r->num_rows > 0){
                    $result = array();
                    while($row = $r->fetch_assoc()){
                        $result[] = $row;
                    }
                    $this->response($this->json($result), 200); // send user details
                }
            }
            $this->response('',204);	// If no records "No Content" status
        }
        /*
         *	Encode array into JSON
        */
        private function json($data){
            if(is_array($data)){
                return json_encode($data);
            }
        }
        
    }
    // Initiiate Library
    $api = new API;
    $api->processApi();
?>
