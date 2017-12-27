<?php

namespace ClientBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * AuthAccessToken
 *
 * @ORM\Table(name="auth_access_token")
 * @ORM\Entity(repositoryClass="ClientBundle\Repository\AuthAccessTokenRepository")
 */
class AuthAccessToken
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;


    /**
     * @var string
     *
     * @ORM\Column(name="token", type="text")
     */
    private $token;
    /**
     * @ORM\OneToOne(targetEntity="Client")
     * @ORM\JoinColumn(name="client_id", referencedColumnName="id")
     */
     private $client;
     /**
      * Get idClient
      *
      * @return int
      */
     public function getClient()
     {
         return $this->client;
     }
     /**
      * Set client
      *
      * @param Client $client
      *
      * @return AuthAccessToken
      */
     public function setClient($client)
     {
         $this->client = $client;

         return $this;
     }

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set token
     *
     * @param string $token
     *
     * @return AuthAccessToken
     */
    public function setToken($token)
    {
        $this->token = $token;

        return $this;
    }

    /**
     * Get token
     *
     * @return string
     */
    public function getToken()
    {
        return $this->token;
    }
}
