Okay, we have started recording, so I'll just. I'll just repeat what I just said. I think this hard exclusion is good. If you allow me, I'll compare it in a second with the results that I got from Cloth Coat. But so the hard exclusion should be indeed done. One thing that I see immediately here that should not be in the hard exclusion is the fragrance. The fragrance should be the last question in the questionnaire where we ask the customer whether we want the product without fragrance with fragrance number one or with fragrance number two. And so that should be entirely the choice of the customer to choose the fragrance for the product. And so this should not be a hard exclusion here. Okay, so.
Because I will use this.
So in fact, fragrance will be the last question. Yes, and probably the last filter in our questionnaire. Okay, so can I quickly share my screen? I'll take. Because as I told you, I have quite a similar. Okay, similar exercise. Quickly share my screen here. So gate one again. Yeah, tell me when you see my screen.
I see it.
Okay, gate one. Skin type is the same as you. So hard gate, hard elimination. Basically, we have 18 formulas for orally. We have 18 formulas for dry, we have 18 formulas for combination, 18 formulas for sensitive. This is not based on the actual formulas that we have today in the database. This is ideal world. And start. Yeah, so, but that's basically the same step as yours. Heart gait on the skin type. Question 11. Then we have exclusions. I have a few more exclusions than yours. For example, I also have. I'll increase it a bit. I also have rosacea and eczema as possible products to exclude. No pegs. And then again, as I told you, I have this fragment thing, but actually this should be excluded from the safety gate too.
Okay, but in essence, I think that we have more or less the same reasoning on your side and on my side here. And then so you. I'll ask you to share again your slides, but you start having a. A point system which works with tripling the weight of certain categories. And so that's where it starts to be different from what I have here. So can you show again your PowerPoint how it works?
Okay. Can we show at the same time?
I'm not sure. I don't think so. But do you want me to send you sis, do you want me to send you this so you can put it side by side or. Yes, please quickly send it to you. All right. Okay, send it away. Okay, just check it. And just so that. Just so that you know, Edson, this is so I've also read some things that are not correct in here. Okay.
Okay.
So it's not perfect yet. The analysis also. I mean also mine. Right. So we'll still have to refine it.
Okay,
So let's see. Yeah. This is number two. Okay. Number three, we've done the exclusion and then number four. Step four. So when two plus products survive filters scoring determines the winner. Okay, I agree. Map concerns customer quiz concerns example breakouts oiliness map to ingredients derived capability tags Acne oil control brightening. So this means that we have to add these tags and fields in each product in the database. Right. Because otherwise there will be no way to map them. I don't know if you. So yeah, then priority multipliers. Number one priority receives treat. Okay, I understand. So once. But this is after all the hard filtering has happened already. Right? After all the hard filtering has happened. We prioritize. Number 1 priority times 3. Number 2 priority times 2. Number 3 priority times 1.5 and then the rest just once.
Then we do have a final score plus bonus for number of active ingredients. Highest score wins. Ok I in principle agree with this, but so now we should check how this works in practice. Can you show the rest of your slides? I'm just curious also to see how. What. So customer profile score Example concerns breakouts on this number ones.
Which one priority?
This one? Yeah, yeah, this one clarifying winner is so one because we got 66 points for so one. So two. 14 points. 40 points. Okay. Okay. Three possible outcomes. Exact match, no scoring needed. That's perfect. Happy flow scenario. We agree multiple matches two plus products survive. Scoring picks the best match Fire concern overlap priority ranking. Then no match 0 product survive all exclude by safety filters. Engine returns a gap message and flags a catalog gap for team purchase. Okay. More or less. Okay, more or less. Agreed. And then scales without code changes.
Okay, this is. Currently we're at V1. There are only five to seven products here. For V2 we will have the ingredient map because right now we don't have it.
Yeah. And then. Okay so here also where I have a kind of similar. Let's see. So I like your priority. Your priority better. We should. We should realign with the questions that we have. But I think it can work then. So I have some examples here also critical completely. Okay, so modularity and future proofing. So if this one. No, I'll share my screen now. Okay, so this is the document that I just sent you. So the engine is designed to grow with the brand. Right. Adding a new formula. Add one formula to the formula registry with these fields. Code name, skin type, product type. And then this is important because this we don't have for the moment concern tags, key actives. Okay, we have them but we should also have some kind of map of what these actives do.
Active family, texture class, retinal level and five safety flags. The scoring engine includes it automatically in the next quiz run. No changes to quiz questions, gate logic or scoring weights are needed. Okay, replacing a proposed formula when a proposed formula is actually developed by Greenberry. Updated status from proposed to completed and adjust the actives names if the final formulation differs. Yeah, okay, this is something else. Okay. And basically it comes down that we need to think this. Even these fields, I'm not 100% sure but we should certainly start with deciding in the database which fields we need to have so that the matching engine can work. Right. And so today I'm not sure what we have. Let's see again we checked it yesterday. So today if I take so one.
Again this one Skin type for sure should be a pick list, a drop down selection. Today it's a manual fields text field that we cannot allow this. This should be either oily skin, dry skin, combination skin or sensitive skin. Right? Of course. Serum. Yes. But then you see that we're missing quite a lot of the rest of the data. So maybe we should have something. So of course we have the ingredients. Maybe we should have something like an option somewhere like a sub menu of the product page which is. Because otherwise we're going to have too many fields here. Right? So maybe we want to have an extra sub page of the product which is dedicated specifically for matching. Yeah, no, I mean for. For. For making. For making a. So adding a product we can do out of here, right?
So here we can add a product. Yeah, but we should also have like this data, right? This data. So okay, the code, we kind of have it somewhere. I guess maybe not. But we can add this. There's no problem with the name. We have skin type, we have product type, we have. But this we don't have concern tags. So either we add a field but then we start having a lot of fields. So maybe we should just add an extra sub page like an extra sub page of this create product page which would be data or something like matching engine data or something like this. Then we can put the tags. We're talking about actives here. No, not here. If we add an ingredient here, for example, select an ingredient. Aqua gel. We need to put the function.
The function is already in the ingredient page. So, so if we look at the ingredients, when we add an ingredient, we have function here, but it's also free text, which is not ideal. So I think rather we should make a sub page for each product page, which is matching engine data or whatever, something like this. And we should add for sure concern tags. Key actives, maybe active family, I don't know, Texture class, maybe. Makes sense. Retinal level, the five safety flags. I guess we are referring here to the safety gate thing.
I think those tags will be creating new fields on the database.
Yeah, yeah. And so, and so basically we should then add also like toggles, right. For each of these, like is it okay for pregnant women? Then, you know, make it like toggle it or on toggle it, depending on the logic that we apply. Is it okay for people who have rosacea? Is it okay for people who have eczema? Does it contain retinol? Does it contain bha? Does it contain pegs? Right.
Yes.
So is it more or less clear what I'm saying or not Right now
It's all too much. But yeah, I follow.
So we just create this new sub page under. That's my logic. Right. Maybe you can challenge my logic. But now we have the database comes out of these products basically for the matching engine. So if we have SD2, then we already have some data which we can use. But this is not sufficient for the matching engine. For the matching engine, we need to add more data so that the matching engine can recognize what concerns this product will tackle if it's safe for pregnant women, stuff like this. And all this is data today we don't have. So we need to make a sub page. So maybe like add a tab here or something. Maybe here or somewhere. Or maybe there will be a button like here, like extra data or matching engine data, something that brings us to another page.
Or maybe that doesn't make sense. I don't know. Maybe we should just leave everything in one page.
Yeah. In erp. Much better. Or much more cleaner. Cleaner approach.
If we keep it in one page.
Yes, in the erp.
Okay. Okay. Okay, that's good. That's okay. We can leave it in one page. It's just that we already have some. Okay, but let's leave it in one page. So we should make sure that these things are never free text. Right. Otherwise we're going to have a problem with the matching engine.
What do you mean by free text?
Like that? The fields. The fields are not free text.
Yeah. Yes.
Because here you see skin type is still free. Text. This is dangerous. Yeah. Because I can make a mistake like this and then it's gonna up the. The. The. The database. Right. So. So we should make sure that it's always the correct. Right.
It's a string. Yeah. Yeah, we need to make it.
Yeah, it should be a drop down. Yeah. And like here, like for example here we have a clean list of which we can choose, right?
Yes.
We should have this also for. Here for the types of skin. We should I guess have it for the concerns. For the concerns which are listed in the questionnaire.
Right.
So the questionnaire being where Consultation quiz. Where is this? Here, like here, this list. Right. Remember, what are your biggest skin concerns? I guess we should have this in a drop down as well. Yeah.
Okay.
And then we should for sure have safety exclusions to indicate whether the product is safe or not. For people who have these conditions. I think that's an acceptable first like business requirements to try to make the database compliant with the matching engine. All right, so maybe start with this.
So we will make those customization, I mean additional pages and fields on the ERP connecting it to the database. Is that what the priority right now, right?
I think so. Because if we don't have this, then our matching engine is not going to work, right?
Yes. And currently it only works by fetching what's currently in the database. If you want to test it.
Yeah, that's normal. That's. That's normal. So. But you already have it.
Yeah. Yes, Once you completed the quiz it will.
Oh, once you go. Okay, okay. Once you complete the quiz it goes. Okay, so let me quickly test this.
Hold on, let me just publish it in Vercel as production because it needed the Supabase key.
Yep.
Oh, then
Per cell.
Next public. Employment. Do you still have the URL?
Can you share it again?
Okay, let me just finish it. Deploy first. It's just going to take like 30 seconds.
Okay,
That's right. We have different repository for the ERP as well.
Say again?
We have different project directory for the ERP and the website.
And in the end, did we publish this, the ERP to the domain name or. Not yet.
Not yet. I'm thinking that we need to do the database first before doing that. But it's fine, I can do that as well because it's just going to take a second. I mean like 30 minutes to set up.
Yeah, I'm just thinking because I think we should maybe publish the version of in production on the domain. On the real domain name already, just to have correct data.
Yeah.
There so that we can start using the Vercel version as a test version and that we can fully play around with the data. Okay, so do you confirm that the database of the testing environment and the actual domain name will not be the same database?
It will be the same. They will fetch the same database. They want it to be separate.
Can we separate the two databases? Because if we start testing the matching engine. I would like to create dummy products in the. In the list here. But I don't want those dummy products to stay in the final version of the. Of the production on recip 3.
So there will be like testing cases for the. A test database. Yeah, that could work.
Which I would like to keep separate from the actual. Because I mean here in the product it's not really a big deal. If we create new ones, we can delete them. It's not a big problem. But here we already have quite a lot of data in the procurement part where we've already kind of bought a lot, you know, this is real data, all these quantities that we have. This is all. Martin that has a. Has registered all this in the system here, you know, he's made all these orders here. So I would like to just keep it. I would like to keep this clean. So just to put this in the production environment, not touch it, not play around with it and we'll play around in a test environment with separate databases. Is that good?
Yes, hold on. I'm looking for the. Quiz. I. I don't think I put it on Vercel. Right. Yeah, it's. It's my Vercel account. Hold on. The ERP is it's in your. But the website is actually on mine.
In yours. Okay.
Yes, hold on. I think we should manage this directories cleaner on my next shift. So in order for us not to get confused where they are.
Yeah, you can centralize them in my Vercel.
Yes, Let me just confirm it. There. It's already live, so I'm going to give you the URL. Okay, that's it, that's the URL.
Okay, Begin consultation now. I'll just. I'll just do some random stuff. Right. So yeah, this will change later, but for moment this looks like it's a button and it's not a button. So we should change the ui. Yes, but we'll do that in time. I'm just going to do some random stuff. Okay, Nice. Here also I'm not entirely sure, so I'm not sure why. This one for example remains grayed out, you see. No, no, this One is grayed out. Do you see it? So if I move it, number three is grayed out. I don't know why.
I'll look into that.
And so if I move this one somewhere and so here what's funny also for me is that so I can drag them and then shows like it highlights another block instead of showing me the space between two blocks where it would land. You understand what I mean?
Yeah, they like just swap places.
Yeah, yeah, I understand. But what I would expect is rather than this block highlighting here. You see now brown, you see how it's highlighting. I would expect, I would expect that this, if I do like this, I would expect that the space between number two and number three shows a line. You know? You know what I mean?
The usual modern stuff.
Yeah, yeah. So yeah, this one we also should remove. But. Okay, but we'll do a more in depth analysis of the questions a bit later. But of course we should remove fragrance free or we could leave this fragrance free so that we don't have to ask the last question. Maybe I don't. We'll see. Anyways, we should keep some consistency. If we keep this option fragrance free here, then of course we should not ask at the end of the quiz whether the customer wants a product with fragrance one or fragrance two. Right. How adventurous are the skincare ingredients? Retinol. Here. Yeah. I wonder how we're going to process also the free text here.
Yeah, but that's a bit tricky because it's actually freestyle chat.
Yeah.
We cannot automate. I think it's best to be removed. Or we should add some drop down instead.
Well, yeah. So maybe we should make an option somewhere where it says in a different question maybe where we have maybe like do you have any allergies? And if the customer clicks yes. Then there would be maybe a drop down list which we could include in one of the gates and then there would also be another option and then if the other option there would be free text and that would be like a manual check needed by a human. Right. In order to, in order to assign the correct. The correct.
Yes. All right.
Complete. Thank you. See your results.
All right.
Your serum match. Very good. All right, so this is very good. With key actives.
There should be a picture of the product here, but we don't have it yet. But it should be in this space.
That's very nice. That's very nice. I think that's very nice. We'll change this because we're not going to advertise this one, of course, but we're going to put a full description of the ingredients. That's what we're going to do. This is already very nice. And then what is important, this is maybe something that I don't highlight often enough is that our brand is going to be Eastern European skincare. Right. So we are making our products so that they include extracts from specific plants from Eastern Europe. Specific, you know, plants, trees, other kinds of extracts. And we're going to highlight those here. So instead of having the key active zinc and salicylic. Salicylic acid, we're going to have here. I think it's. It's the salix nicra something. If we take product. So one, I think here it should be this one.
So we're going to have this one and I would like to add some as well. So I'm currently talking with the chemist to add more of these things. And so for example, if you look at this. So we have some of this, like this here. That's what. This is what I would like also. And this is going to be after we do the matching. Well, after we do the matching engine. But in a way I want you to keep that in mind as you are building the meshing engine. Because what I would like is similar to something that we've seen on other websites and I don't remember exactly which one is that. When you are. So the first questions are all about. So about you and all this and tak tack. And so this is all random stuff about myself.
Okay.
Like this and then your skin. When we start this section, I would like to put something visual so that you know that the matching engine has already started. And so oily skin. I click oily skin. And then all of a sudden an ingredient will appear here, you know, and this. And if I, if I do the second one, dryness, maybe two ingredients will appear here or here somewhere that you can see that there is some effort being done in the personalization and then these ingredients can come and go depending on how the quiz is evolving. Right. But that's going to be another layer of complexity that we're going to build in a bit later. But okay, that's just for you to know. But indeed, I think this is quite nice.
Okay, Edson, I think with all this information, I think you have quite a lot to process. So yeah, just start working on that. We can do another call tomorrow. I guess you don't need my inputs immediately because you have quite enough of it for today and so I'll send you the video recording and.
Yes, please.
And then let's continue tomorrow. Yeah, yeah.
I will actually review everything that we talk about here and implement that on the next. Next run. And I. I think I will need to centralize first the files, the repository and the projects in your vercel.
Very good. Okay.
Okay, thanks.
Perfect. Then I'll talk to you later. Bye. Thank you very much. Have a good day.
Good day.
