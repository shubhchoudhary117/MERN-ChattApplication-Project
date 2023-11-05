{
    HideCreatePostPopup ? "" :
      <div className="post" id={HideCreatePostPopup?"close-popup":""}>
        <ClearOutlinedIcon className='close-icon' onClick={()=>setHideCreatePostPopup(true)} />
        <div className="createPost-popup">
          <div className="createPost-wrapper">
            <div className="header">
              {!nextProcess && imagesIsSelected ? <div className="exit" onClick={canclePost}> <ArrowBackOutlinedIcon className='icon' /></div> : ""}
              <div className="previous" onClick={() => setNextProcess(false)}>{nextProcess ? <ArrowBackOutlinedIcon className='icon' /> : ""}</div>
              <div className="heading">Create new post</div>
              <div className="next" onClick={() => setNextProcess(true)}>{imagesIsSelected ? "next" : ""}</div>
            </div>
            <div className="process-container">
              {/* image selection process content */}
              {
                nextProcess ?
                  <div className="fill-details-process">
                    <div className="fill-details-wrapper">
                      <div className="form-group">
                        <textarea placeholder='caption' onChange={(e) => setCaption(e.target.value)}></textarea>
                      </div>

                      <div className="share-btn"><button onClick={AddPost}>share</button></div>
                    </div>
                  </div>
                  :
                  <div className="select-image-process">
                    <div className="createPost-content">
                      {
                        imagesIsSelected ?
                          <>
                            <div className="choosed-image">
                              <img src={uploadedImage} alt="" />
                            </div>
                          </>
                          :
                          <div>
                            <div className="icons">
                              <PhotoOutlinedIcon className='icon' />
                              <SlideshowOutlinedIcon className='icon' />
                            </div>
                            <h6 className="createPost-title">Drag photos and videos here</h6>

                            <button><label htmlFor="file">select</label> <input onChange={onFileChange} type="file" id='file' /></button>
                          </div>
                      }
                    </div>
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
  }