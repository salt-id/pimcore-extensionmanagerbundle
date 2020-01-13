<?php

namespace SaltId\ExtensionManagerBundle\Controller;

use Symfony\Component\HttpFoundation\ {Request, Response};
use SaltId\ExtensionManagerBundle\Service\PackagistService;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    const STATIC_FILE = __DIR__ . '/../Static/list.json';

    /**
     * @Route("/list")
     */
    public function listAction(Request $request)
    {
        return $this->json(json_decode(file_get_contents(self::STATIC_FILE), true), 200);
    }
}
