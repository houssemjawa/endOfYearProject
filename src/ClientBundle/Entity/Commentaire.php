<?php

namespace ClientBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Commentaire
 *
 * @ORM\Table(name="commentaire")
 * @ORM\Entity(repositoryClass="ClientBundle\Repository\CommentaireRepository")
 */
class Commentaire
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
     * @var text
     *
     * @ORM\Column(name="commentaire", type="text")
     */
    private $commentaire;
    /**
     * @var \DateTime
     *
     * @ORM\Column(name="datecom", type="datetime")
     */
    private $datecom;

    public function setDatetime($datetime)
    {
        $this->datetime = $datetime;

        return $this;
    }

    /**
     * Get datetime
     *
     * @return \DateTime
     */
    public function getDatetime()
    {
        return $this->datetime;
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
     * Set content
     *
     * @param text $content
     *
     * @return Commentaire
     */
    public function setContent($content)
    {
        $this->content = $content;

        return $this;
    }
    /**
     * @ORM\ManyToOne(targetEntity="Publication")
     * @ORM\JoinColumn(name="publication_id", referencedColumnName="id")
     */
     private $publication;
     /**
      * @ORM\ManyToOne(targetEntity="Client")
      * @ORM\JoinColumn(name="client_id", referencedColumnName="id")
      */
      private $client;

    /**
     * Get content
     *
     * @return text
     */
    public function getContent()
    {
        return $this->content;
    }
    public function  getPublication(){
      return $this->publication;
    }
    public function  geClient(){
      return $this->client;
    }
    public function  setPublication($publication){
      $this->publication=$publication;
    }
    public function  setClient($client){
      $this->client=$client;
    }
    public function __construct(){
      $this->datecom = new \DateTime();
    }


    /**
     * @param text $commentaire
     */
    public function setCommentaire($commentaire)
    {
        $this->commentaire = $commentaire;
    }

    /**
     * @return text
     */
    public function getCommentaire()
    {
        return $this->commentaire;
    }
}
