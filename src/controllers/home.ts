import { Request, Response } from "express";

/**
 * GET /
 * Home page.
 */
export const index = (req: Request, res: Response) => {
    res.render("pages/founderForm", {
        title: "Home"
    });
};


/**
 * GET /
 * Home page.
 */
export const test = (req: Request, res: Response) => {
    console.log(req.params)
    res.render("pages/founderForm", {
        title: "Home"
    });
};
