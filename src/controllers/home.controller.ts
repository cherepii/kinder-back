import { Request, Response } from "express";

/**
 * GET /api
 * Home page.
 */
const renderIndex = async (req: Request, res: Response): Promise<void> => {
    res.render("index", { title: "Express" });
};

export const HomeController = {
    renderIndex,
};
