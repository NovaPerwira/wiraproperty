<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SitePage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PageCmsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('cms/pages/index', [
            'pages' => SitePage::with('editor:id,name')->orderBy('title')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('cms/pages/edit', [
            'page'      => null,
            'templates' => ['default', 'about', 'contact', 'landing', 'legal'],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'        => 'required|string|max:255',
            'slug'         => 'nullable|string|max:255|unique:site_pages',
            'content'      => 'nullable|string',
            'template'     => 'nullable|string',
            'is_published' => 'boolean',
            'meta'         => 'nullable|array',
        ]);

        $data['slug']       = $data['slug'] ?? Str::slug($data['title']);
        $data['updated_by'] = auth()->id();
        if ($data['is_published'] ?? false) {
            $data['published_at'] = now();
        }

        SitePage::create($data);
        return redirect()->route('cms.pages.index')->with('success', 'Page created.');
    }

    public function edit(SitePage $page): Response
    {
        return Inertia::render('cms/pages/edit', [
            'page'      => $page,
            'templates' => ['default', 'about', 'contact', 'landing', 'legal'],
        ]);
    }

    public function update(Request $request, SitePage $page)
    {
        $data = $request->validate([
            'title'        => 'sometimes|string|max:255',
            'slug'         => 'sometimes|string|max:255|unique:site_pages,slug,' . $page->id,
            'content'      => 'nullable|string',
            'template'     => 'nullable|string',
            'is_published' => 'boolean',
            'meta'         => 'nullable|array',
        ]);

        $data['updated_by'] = auth()->id();
        if (($data['is_published'] ?? false) && ! $page->published_at) {
            $data['published_at'] = now();
        }

        $page->update($data);
        return back()->with('success', 'Page saved.');
    }

    public function destroy(SitePage $page)
    {
        $page->delete();
        return redirect()->route('cms.pages.index')->with('success', 'Page deleted.');
    }
}
