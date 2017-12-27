<?php

namespace ClientBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\Head;
use FOS\RestBundle\Controller\Annotations\Put;
use FOS\RestBundle\Controller\Annotations\Delete;
use FOS\RestBundle\Controller\Annotations\Post;
use FOS\RestBundle\Controller\Annotations\Patch;
use FOS\RestBundle\View\ViewHandler;
use FOS\RestBundle\View\View;
use FOS\RestBundle\Controller\Annotations as Rest;
use ClientBundle\Entity\Client;
use ClientBundle\Entity\Follow;
use ClientBundle\Entity\AuthAccessToken;
use ClientBundle\Entity\Publication;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;


class ClientController extends Controller
{
  /**
  *@Rest\View()
  *@Rest\Post("/register")
  */
  public function postClientAction(Request $request){
    $client = new Client();
    $uploadedfile = $request->files->get('file');
    $username = $request->get('username');
    $directory = __DIR__.'/../../../../pfa_alpha/web/views/uploads/clientPhoto/'.$username;
    foreach($request->files as $uploadedFile) {
        $file = $uploadedFile->move($directory, $uploadedFile->getClientOriginalName());
    }
    $client->setFile($uploadedfile);
    $client->path="./uploads/clientPhoto/".$username."/".$uploadedFile->getClientOriginalName();
    $email = $request->get('email');
    $phone = $request->get('phone');
    $adresse = $request->get('adresse');
    $password = $request->get('password');
    $nom = $request->get('nom');
    $prenom = $request->get('prenom');
    $client->setUsername($username);
    $client->setEmail($email);
    $client->setPlainPassword($password);
    $client->setPhone($phone);
    $client->setAdresse($adresse);
    $client->setNom($nom);
    $client->setPrenom($prenom);
    $client->setEnabled(true);
    if (empty($client)){
      return new JsonResponse(["message" => "you sent nothing !"]);
    }
    $em = $this->get('doctrine.orm.entity_manager');
    $em->persist($client);
    $em->flush();
    return new JsonResponse(["message" => "successfully created"]);
  }
  /**
  *@Rest\View()
  *@Rest\Post("/signin")
  */
  public function postAuthentificationAction(Request $request){
    $em = $this->get('doctrine.orm.entity_manager');
    $client = $em->getRepository('ClientBundle:Client')->findOneByUsername($request->get('username'));
    $token = $request->get('token');
    if (empty($client)||empty($token)) {
          return new JsonResponse(['message' => 'you are not registred may be'], Response::HTTP_NOT_FOUND);
      }
    $auth1 = $em->getRepository('ClientBundle:AuthAccessToken')->findOneByClient($client);
    if(empty($auth1)){
      $auth = new AuthAccessToken();
      $auth->setToken($token);
      $auth->setClient($client);
      $em->persist($auth);
      $em->flush();
    }
    else{
      $auth = new AuthAccessToken();
      $auth->setToken($token);
      $auth->setClient($client);
      $em->remove($auth1);
      $em->flush();
      $em->persist($auth);
      $em->flush();
    }
    return $client ;
  }
  /**
  *@Rest\View()
  *@Rest\Post("/profile")
  */
  public function profileAction(Request $request){
    $em = $this->get('doctrine.orm.entity_manager');
    $auth = $em->getRepository('ClientBundle:AuthAccessToken')->findOneByToken($request->get('token'));
    if(empty($auth)){
        return new JsonResponse(['message' => 'to']);
    }
    $id = $auth->getClient()->getId();
    $client = $em->getRepository('ClientBundle:Client')->find($id);

    return $client;
  }
  /**
  *@Rest\View()
  *@Rest\Get("/gettoken/{id}")
  */
  public function getTokenAction(Request $request){
    $id = $request->get('id');
    $em = $this->get('doctrine.orm.entity_manager');
    $auth = $em->getRepository('ClientBundle:AuthAccessToken')->find($id);
    return $auth;
  }
/**
  *@Rest\View()
  *@Rest\Get("/Client/{id}")
  */
  public function getClientByID (Request $request){
 $id = $request->get('id');
  $em = $this->get('doctrine.orm.entity_manager');
  $auth = $em->getRepository('ClientBundle:Client')->find($id);
    return $auth;
  }
  /**
  *@Rest\View()
  *@Rest\Post("{id_etablissement}/like/{id_client}")
  */
  public function postLikeAction(Request $request){
    $em = $this->get('doctrine.orm.entity_manager');
  $client = $em->getRepository('ClientBundle:Client')->find($request->get('id_client'));
    $etablissement = $em->getRepository('ClientBundle:Etablissement')->find($request->get('id_etablissement'));
    if(empty( $client ) || empty(  $etablissement ) ){
        return new JsonResponse(['message' => 'you are not authentified']);
    }else{    
    $like = new Follow();
    $like->setClient($client);
    $like->setEtablissement($etablissement);
    $em->persist($like);
    $em->flush();
    return $etablissement;
  }
  }
  /**
  *@Rest\View()
  *@Rest\Delete("/disconnect/{token}")
  */
  public function deleteAuthAction(Request $request){
    $em = $this->get('doctrine.orm.entity_manager');
    $auth = $em->getRepository('ClientBundle:AuthAccessToken')->findOneByToken($request->get('token'));
    if(empty($auth)){
        return new JsonResponse(['message' => 'you are not authentified']);
    }
    $em->remove($auth);
    $em->flush();
  }
  /**
  *@Rest\View()
  *@Rest\Get("/isadmin/{token}/{id_page}")
  */
  public function isadminAction(Request $request){
    $em = $this->get('doctrine.orm.entity_manager');
    $auth = $em->getRepository('ClientBundle:AuthAccessToken')->findOneByToken($request->get('token'));
    if(empty($auth)){
        return new JsonResponse(['message' => 'you are not authentified']);
    }
    $id_client = $auth->getClient()->getId();
    $id_etablissement = $request->get('id_page');
    $etablissement =   $auth = $em->getRepository('ClientBundle:Etablissement')->find($id_etablissement);
    if($id_client==$etablissement->getAdmin()->getId()){
      return new JsonResponse(["response" => true]);
    }
    else {
      return new JsonResponse(["response" => false]);
    }
  return $etablissement;
  }

}
