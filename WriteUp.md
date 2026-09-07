# Write-up

> This is the skeleton - replace everything in blockquotes with your own words
> and delete the prompts as you go. Aim for **~300 words** across the four
> questions; the route reference below can be as long as it needs to be.
>
> Write it like you're handing the work to a teammate. We'd rather read an
> honest "I ran out of time on X and here's what I'd do" than a polished list of
> accomplishments. **Submit this even if you didn't finish** - see CHALLENGE.md.

## 1. What did you build for Part B, and why that?

> Disclaimer: I am 100% new to this type of development, so please forgive me for my lack of understanding and AI use. :\

> Since the purpose of this website is to track Brennen's restaurants, visits, and spending, I 
> a.) added a feature to see Brennen's visits (restaurant, date, amount spent, and comment) alongside the restaurants he like to inform the users of this website about the prices and reviews of the restaurants. 
> b.) I also added a "View on Google Maps" feature so that whoever uses the website can easily locate these restaurants on a map. 

## 2. What did you decide, and what did you rule out?

> Since the website is called "Feeding Brennen", in other words, it's centered around the co-president's preferences, I thought of putting up some pictures of co-pres Brennen Ho on it. On a second thought, I don't think that this is too appropriate, and I would need his consent. I instead focused on improving features that made the website more convenient to use (e.g. adding Brennen's visits and allowing us to see where exactly on the map). 

## 3. Where did you cut corners?

> If I had more time (and knowledge), I would've implemented a statistical analysis tool to track the general locations of Brennen's eat-outs (kinda like a heatmap), how much he spends and caution him not to overspend, and maybe another feature that suggests new restaurants for Brennen to go to based on his past travels.

---

## Part B: routes

> Every endpoint you added, with its request and response shapes, so we can
> exercise it without reverse-engineering your code. Add or remove rows as
> needed; delete this section if your Part B added no routes.

| Method and path | What it does | Success | Errors       |
| --------------- | ------------ | ------- | ------------ |
| `GET /api/...`  |              | `200` + | `404` if ... |
| `POST /api/...` |              | `201` + | `400` on ... |

**`POST /api/...`**

```jsonc
// request
{ }

// 201 response
{ }
```

## Schema changes

> Any migrations you added (`002_*.sql`, ...), new tables or columns, and
> anything a reviewer needs to run beyond `./setup.sh`. Write "none" if there
> were none.
>
> "none"

## How I verified this

> How you checked your work - the happy paths _and_ the failures. `curl`
> commands, a Postman collection, a scratch script, screenshots: whatever you
> actually used. Paste the commands.
>
> This is much faster for us to review than working it out ourselves, and it's
> how you show you checked the edge cases.

**Part A** - the contract table in CHALLENGE.md, every row including the error
cases:

```bash
# e.g.
curl -i http://localhost:3000/api/restaurants          # 200 + array
curl -i http://localhost:3000/api/restaurants/99999    # 404
curl -i http://localhost:3000/api/restaurants/abc      # 404
curl -i -X POST http://localhost:3000/api/restaurants \
  -H 'Content-Type: application/json' \
  -d '{"name":"Out Of Range","rating":6}'              # 400
```

**Part B** - the equivalent cases for what you built:

```bash

```

## Known issues / what I'd do next

> I cannot manage to get Docker running on my laptop ;( I ended up downloading Postgre locally and using the seeded data. Please help me get it working if possible. 
