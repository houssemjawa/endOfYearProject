<?php

namespace ClientBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Follow
 *
 * @ORM\Table(name="follow")
 * @ORM\Entity(repositoryClass="ClientBundle\Entity\Repository\FollowRepository")
 */
class Follow
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
     * @ORM\ManyToOne(targetEntity="Client")
     * @ORM\JoinColumn(name="client_id", referencedColumnName="id")
     */
     private $client;
     /**
      * @ORM\ManyToOne(targetEntity="Etablissement")
      * @ORM\JoinColumn(name="page_id", referencedColumnName="id")
      */
      private $etablissement;
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
     * Get client
     *
     * @return Client
     */
    public function getClient()
    {
        return $this->client;
    }
    /**
     * Get etablissement
     *
     * @return Etablissement
     */
    public function getEtablissement()
    {
        return $this->etablissement;
    }
    /**
     * Set client
     *
     * @param Client $client
     *
     * @return Follow
     */
    public function setClient($client)
    {
        $this->client = $client;

        return $this;
    }
    /**
     * Set etablissement
     *
     * @param Etablissement $etablissement
     *
     * @return Follow
     */
    public function setEtablissement($etablissement)
    {
        $this->etablissement = $etablissement;

        return $this;
    }

}
