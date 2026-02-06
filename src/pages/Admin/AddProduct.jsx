import React, { useState, useRef, useEffect } from "react";
import { 
  FaCloudUploadAlt, FaVideo, FaCheck, FaTrash, FaImage, 
  FaTruck, FaRulerCombined, FaBoxOpen, FaSave, FaGoogle, 
  FaPlusCircle, FaTimesCircle, FaHeading, FaList, FaListOl, 
  FaBold, FaItalic, FaUnderline, FaAlignLeft, FaAlignCenter, 
  FaAlignRight, FaLink, FaQuoteLeft, FaUndo, FaRedo,
  FaSpinner, FaExclamationCircle, FaArrowLeft, FaEye,
  FaStar, FaRegStar, FaFilter, FaSort, FaCalendarAlt,
  FaPlayCircle, FaFileVideo, FaFileImage, FaArrowsAlt,
  FaCompress, FaExpand, FaEdit, FaCopy, FaHeart,
  FaShare, FaDownload, FaSync, FaRandom, FaEllipsisH,
  FaPalette, FaTags, FaShoppingCart, FaPercent,
  FaRupeeSign, FaCube, FaWeight, FaRulerVertical,
  FaShippingFast, FaBox, FaLayerGroup, FaMagic,
  FaChartLine, FaUser, FaEnvelope, FaCalendar,
  FaThumbsUp, FaThumbsDown, FaReply, FaExclamationTriangle,
  FaInfoCircle, FaQuestionCircle, FaCode, FaDatabase,
  FaServer, FaNetworkWired, FaCog, FaWrench, FaTools,
  FaBell, FaHistory, FaClock, FaBan, FaLock, FaUnlock,
  FaKey, FaUserSecret, FaShieldAlt, FaUserCheck,
  FaUserPlus, FaUserMinus, FaUsers, FaUserFriends,
  FaUserCircle, FaUserTag, FaUserEdit, FaUserCog
} from "react-icons/fa";
import { 
  MdOutlineTitle, MdDescription, MdLocalOffer, 
  MdFormatColorText, MdReviews, MdThumbUp, MdThumbDown,
  MdVideoLibrary, MdPhotoLibrary, MdInsertPhoto, MdMovie, MdCategory, MdLabel, MdColorLens,
  MdSecurity, MdSettings, MdBuild, MdExtension,
  MdDashboard, MdInventory,
  MdAssessment, MdTrendingUp, MdShowChart, MdMultilineChart,
  MdPieChart, MdBarChart, MdTimeline, MdInsertChart,
  MdAttachFile, MdInsertDriveFile, MdFolder, MdFolderOpen,
  MdCloudUpload, MdCloudDownload, MdCloud, MdCloudQueue,
  MdCloudDone, MdCloudOff, MdBackup, MdRestore,
  MdArchive, MdUnarchive, MdDelete, MdDeleteForever,
  MdDeleteSweep, MdDeleteOutline, MdRemoveCircle,
  MdRemoveCircleOutline, MdCancel, MdBlock, MdReport,
  MdWarning, MdError, MdInfo, MdCheckCircle,
  MdRadioButtonUnchecked, MdRadioButtonChecked,
  MdCheckBox, MdCheckBoxOutlineBlank, MdIndeterminateCheckBox,
  MdToggleOn, MdToggleOff, MdStar, MdStarBorder,
  MdStarHalf, MdGrade, MdFavorite, MdFavoriteBorder,
  MdBookmark, MdBookmarkBorder, MdTurnedIn, MdTurnedInNot,
  MdRateReview, MdComment, MdForum, MdChat,
  MdChatBubble, MdChatBubbleOutline, MdQuestionAnswer,
  MdContactSupport, MdHelp, MdHelpOutline, MdLiveHelp,
  MdFeedback, MdAnnouncement, MdNotifications,
  MdNotificationsNone, MdNotificationsActive,
  MdNotificationImportant, MdPriorityHigh,
  MdNewReleases, MdUpdate, MdAccessTime,
  MdSchedule, MdTimer, MdAvTimer, MdHourglassEmpty,
  MdHourglassFull, MdWatchLater, MdAlarm, MdAlarmAdd,
  MdAlarmOn, MdAlarmOff, MdSnooze, MdTimerOff,
  MdTimer10, MdTimer3, MdMoreTime, MdMoreVert,
  MdMoreHoriz, MdMenu, MdMenuOpen, MdClose,
  MdExpandMore, MdExpandLess, MdChevronRight,
  MdChevronLeft, MdArrowDropDown, MdArrowDropUp,
  MdArrowRight, MdArrowLeft, MdArrowUpward,
  MdArrowDownward, MdArrowForward, MdArrowBack,
  MdKeyboardArrowRight, MdKeyboardArrowLeft,
  MdKeyboardArrowUp, MdKeyboardArrowDown,
  MdSubdirectoryArrowRight, MdCallMade, MdCallReceived,
  MdCallMerge, MdCallSplit, MdCallToAction,
  MdCall, MdCallEnd, MdCallMissed,
  MdPhone, MdPhoneEnabled, MdPhoneDisabled,
  MdPhoneInTalk, MdPhoneCallback, MdPhoneForwarded,
  MdPhoneMissed, MdPhonePaused, MdRingVolume,
  MdVoicemail, MdDialpad, MdContacts, MdContactPhone,
  MdContactMail, MdImportContacts, MdPermContactCalendar,
  MdRecentActors, MdAccountBox, MdAccountCircle,
  MdPerson, MdPersonOutline, MdPersonAdd,
  MdPersonRemove, MdGroup, MdGroupAdd, MdPeople,
  MdPeopleOutline, MdPersonPin, MdPersonPinCircle,
  MdAssignmentInd, MdAssignmentTurnedIn, MdVerifiedUser,
  MdSupervisorAccount, MdExitToApp, MdAccountBalance,
  MdAccountBalanceWallet, MdMonetizationOn,
  MdAttachMoney, MdMoney, MdMoneyOff, MdEuroSymbol,
  MdCurrencyRupee, MdCurrencyYen, MdCurrencyPound,
  MdPayment, MdCreditCard, MdCardGiftcard, MdCardMembership,
  MdCardTravel, MdRedeem, MdShoppingCart, MdShoppingBasket,
  MdStore, MdStoreMallDirectory, MdLocalGroceryStore,
  MdLocalConvenienceStore, MdLocalCafe, MdLocalBar,
  MdLocalRestaurant, MdLocalPizza, MdLocalDrink,
  MdLocalFlorist, MdLocalGasStation, MdLocalHospital,
  MdLocalHotel, MdLocalLaundryService, MdLocalLibrary,
  MdLocalMall, MdLocalMovies,
  MdLocalParking, MdLocalPharmacy, MdLocalPhone,
  MdLocalPlay, MdLocalPostOffice, MdLocalPrintshop,
  MdLocalSee, MdLocalShipping, MdLocalTaxi,
  MdLocationOn, MdLocationOff, MdMyLocation,
  MdPlace, MdAddLocation, MdEditLocation,
  MdNearMe, MdPinDrop, MdMap, MdDirections,
  MdDirectionsWalk, MdDirectionsBike, MdDirectionsBus,
  MdDirectionsCar, MdDirectionsRailway, MdDirectionsTransit,
  MdDirectionsBoat, MdFlight, MdHotel, MdRestaurantMenu,
  MdLocalDining
} from "react-icons/md";
import { AiOutlineShopping, AiOutlineUpload, AiOutlineDownload } from "react-icons/ai";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../api/API_URL.js";

// API Configuration
const API_BASE_URL = API_URL + "/admin/products/products.php";

// API Service
const apiService = {
  // Get product by ID
  getProduct: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}?action=get_product&id=${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Save/Update product
  saveProduct: async (productData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}?action=save_product`, productData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  },

  // Upload single file
  uploadFile: async (file, productId = 0, type = 'feature') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    if (productId && productId > 0) {
      formData.append('product_id', productId);
    }
    
    try {
      const response = await axios.post(`${API_BASE_URL}?action=upload_file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Upload multiple files
  uploadMultipleFiles: async (files, productId = 0, type = 'gallery') => {
    const formData = new FormData();
    
    // Append files correctly
    for (let i = 0; i < files.length; i++) {
      formData.append('files[]', files[i]);
    }
    
    formData.append('type', type);
    
    if (productId && productId > 0) {
      formData.append('product_id', productId);
    }
    
    try {
      const response = await axios.post(`${API_BASE_URL}?action=upload_multiple`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  },

  // Add review
  addReview: async (reviewData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}?action=add_review`, reviewData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}?action=get_categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get brands
  getBrands: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}?action=get_brands`);
      return response.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  },

  // Get media
  getMedia: async (productId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}?action=get_media&product_id=${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching media:', error);
      throw error;
    }
  },

  // Get reviews
  getReviews: async (productId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}?action=get_reviews&product_id=${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  // Delete media
  deleteMedia: async (mediaId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}?action=delete_media&id=${mediaId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting media:', error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}?action=delete_product&id=${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Update media order
  updateMediaOrder: async (mediaItems) => {
    try {
      const response = await axios.post(`${API_BASE_URL}?action=update_media_order`, {
        media_items: mediaItems
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating media order:', error);
      throw error;
    }
  }
};

// Review Modal Component
const ReviewModal = ({ show, onClose, onAddReview, productId, productName }) => {
  const [review, setReview] = useState({
    product_id: productId,
    reviewer_name: "",
    reviewer_email: "",
    rating: 5,
    review_title: "",
    review_text: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (productId) {
      setReview(prev => ({ ...prev, product_id: productId }));
    }
  }, [productId]);

  if (!show) return null;

  const validateForm = () => {
    const newErrors = {};
    
    if (!review.reviewer_name.trim()) {
      newErrors.reviewer_name = "Name is required";
    }
    
    if (!review.review_text.trim()) {
      newErrors.review_text = "Review text is required";
    }
    
    if (review.rating < 1 || review.rating > 5) {
      newErrors.rating = "Rating must be between 1-5";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await onAddReview(review);
      setReview({
        product_id: productId,
        reviewer_name: "",
        reviewer_email: "",
        rating: 5,
        review_title: "",
        review_text: "",
        date: new Date().toISOString().split('T')[0]
      });
      setErrors({});
      onClose();
    } catch (error) {
      alert('Failed to submit review: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Add Review</h3>
              {productName && (
                <p className="text-sm text-gray-600 mt-1">For: {productName}</p>
              )}
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
              disabled={submitting}
            >
              <FaTimesCircle size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={review.reviewer_name}
                onChange={(e) => setReview({...review, reviewer_name: e.target.value})}
                className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.reviewer_name ? 'border-red-500' : ''}`}
                placeholder="Your name"
                disabled={submitting}
              />
              {errors.reviewer_name && (
                <p className="text-red-500 text-sm mt-1">{errors.reviewer_name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={review.reviewer_email}
                onChange={(e) => setReview({...review, reviewer_email: e.target.value})}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
                disabled={submitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => !submitting && setReview({...review, rating: star})}
                      className="text-3xl transition-transform hover:scale-110"
                      disabled={submitting}
                    >
                      {star <= review.rating ? 
                        <FaStar className="text-yellow-400" /> : 
                        <FaRegStar className="text-gray-300" />
                      }
                    </button>
                  ))}
                </div>
                <span className="ml-2 text-gray-600 font-bold">{review.rating}/5</span>
              </div>
              {errors.rating && (
                <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Review Title</label>
              <input
                type="text"
                value={review.review_title}
                onChange={(e) => setReview({...review, review_title: e.target.value})}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Great product!"
                disabled={submitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                value={review.review_text}
                onChange={(e) => setReview({...review, review_text: e.target.value})}
                rows="4"
                className={`w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${errors.review_text ? 'border-red-500' : ''}`}
                placeholder="Share your experience with this product..."
                disabled={submitting}
              />
              {errors.review_text && (
                <p className="text-red-500 text-sm mt-1">{errors.review_text}</p>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" /> Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </button>
            <button
              onClick={onClose}
              disabled={submitting}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// React MediaGallery component
const MediaGallery = ({ media, onUpload, onDelete, uploading, productId }) => {
  const fileInputRef = useRef(null);
  
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  // Helper function to get image URL
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('uploads/')) return `${API_URL}/${url}`;
    if (url.startsWith('/')) return `${API_URL}${url}`;
    return `${API_URL}/${url}`;
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Media Gallery</h3>
          <p className="text-sm text-gray-600">
            Upload images and videos (Max 10MB each)
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current.click()}
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium flex items-center gap-2 disabled:opacity-50"
        >
          {uploading ? <FaSpinner className="animate-spin" /> : <FaCloudUploadAlt />}
          {uploading ? 'Uploading...' : 'Upload Media'}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Gallery Grid */}
      {media.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No media uploaded yet</p>
          <p className="text-sm text-gray-500 mb-4">Drag & drop or click to upload</p>
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Select Files
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item, index) => (
            <div key={item.id || index} className="relative border rounded overflow-hidden group">
              {item.media_type === 'image' ? (
                <img
                  src={getImageUrl(item.thumbnail_url || item.media_url || item.url)}
                  alt={item.media_alt || 'Gallery item'}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                  }}
                />
              ) : (
                <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                  <FaVideo className="text-3xl text-white" />
                </div>
              )}
              
              <div className="p-2 bg-gray-50">
                <p className="text-sm truncate">{item.file_name || 'File'}</p>
                <p className="text-xs text-gray-500">
                  {item.media_type === 'image' ? 'Image' : 'Video'}
                </p>
              </div>
              
              <button
                onClick={() => onDelete(item.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Rich Text Editor Component
const RichTextEditor = ({ content, onChange, productId }) => {
  const editorRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    handleInput();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      // Simulate upload - replace with actual API call
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '100%';
        document.execCommand('insertHTML', false, img.outerHTML);
        handleInput();
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert('Error uploading image: ' + error.message);
      setUploading(false);
    }
  };

  const toolbarButtons = [
    { icon: <FaBold />, cmd: 'bold', title: 'Bold' },
    { icon: <FaItalic />, cmd: 'italic', title: 'Italic' },
    { icon: <FaUnderline />, cmd: 'underline', title: 'Underline' },
    { icon: <FaAlignLeft />, cmd: 'justifyLeft', title: 'Align Left' },
    { icon: <FaAlignCenter />, cmd: 'justifyCenter', title: 'Align Center' },
    { icon: <FaAlignRight />, cmd: 'justifyRight', title: 'Align Right' },
    { icon: <FaList />, cmd: 'insertUnorderedList', title: 'Bullet List' },
    { icon: <FaListOl />, cmd: 'insertOrderedList', title: 'Numbered List' },
    { icon: <FaLink />, cmd: 'createLink', title: 'Insert Link', prompt: true },
    { icon: <FaQuoteLeft />, cmd: 'formatBlock', value: '<blockquote>', title: 'Quote' },
    { icon: <FaUndo />, cmd: 'undo', title: 'Undo' },
    { icon: <FaRedo />, cmd: 'redo', title: 'Redo' },
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1 items-center">
        {toolbarButtons.map((btn) => (
          <button
            key={btn.cmd + (btn.value || '')}
            type="button"
            onClick={() => {
              if (btn.prompt) {
                const url = prompt('Enter URL:', 'https://');
                if (url) execCommand(btn.cmd, url);
              } else if (btn.value) {
                execCommand(btn.cmd, btn.value);
              } else {
                execCommand(btn.cmd);
              }
            }}
            className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded"
            title={btn.title}
          >
            {btn.icon}
          </button>
        ))}
        
        {/* Image Upload Button */}
        <label className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded cursor-pointer relative">
          <FaImage />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={uploading}
          />
        </label>
        
        {uploading && (
          <span className="text-sm text-gray-600 ml-2 flex items-center gap-1">
            <FaSpinner className="animate-spin" /> Uploading...
          </span>
        )}
      </div>
      
      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[300px] p-4 focus:outline-none text-gray-700 overflow-y-auto"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

// Reviews Component
const ReviewsComponent = ({ 
  reviews = [], 
  rating = 0, 
  reviewCount = 0,
  onAddReview,
  productId,
  productName
}) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      setDisplayedReviews(showAll ? reviews : reviews.slice(0, 5));
    } else {
      setDisplayedReviews([]);
    }
  }, [reviews, showAll]);

  // Calculate rating distribution
  const ratingDistribution = [5,4,3,2,1].map(star => {
    const starReviews = reviews ? reviews.filter(r => r.rating === star).length : 0;
    const percentage = reviewCount > 0 ? (starReviews / reviewCount * 100) : 0;
    return { star, count: starReviews, percentage };
  });

  return (
    <div className="space-y-8">
      {/* Review Modal */}
      <ReviewModal 
        show={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onAddReview={onAddReview}
        productId={productId}
        productName={productName}
      />

      {/* Reviews Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Customer Reviews</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <div className="flex mr-2">
                  {[1,2,3,4,5].map((star) => (
                    <span key={star} className="text-2xl">
                      {star <= Math.floor(rating) ? 
                        <FaStar className="text-yellow-400" /> : 
                        star === Math.ceil(rating) && rating % 1 !== 0 ? 
                        <FaStar className="text-yellow-400" /> : 
                        <FaRegStar className="text-gray-300" />
                      }
                    </span>
                  ))}
                </div>
                <span className="text-2xl font-bold text-gray-800">{rating.toFixed(1)}</span>
                <span className="text-gray-500 ml-2">out of 5</span>
              </div>
              <span className="text-gray-600">({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})</span>
            </div>
          </div>
          <button 
            onClick={() => setShowReviewModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 whitespace-nowrap"
          >
            <FaPlusCircle /> Write a Review
          </button>
        </div>

        {/* Rating Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-gray-700 mb-4 text-lg">Rating Distribution</h3>
            <div className="space-y-3">
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center w-20">
                    <span className="text-gray-600 w-6">{star}</span>
                    <FaStar className="text-yellow-400 ml-1" />
                  </div>
                  <div className="flex-1">
                    <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-yellow-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-gray-600 w-12 text-right text-sm">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-700 mb-4 text-lg">Share Your Thoughts</h3>
            <p className="text-gray-600 mb-4">
              Your review will help other customers make informed decisions about this product.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => setShowReviewModal(true)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Write a Review
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">
            Customer Reviews ({displayedReviews.length} of {reviewCount})
          </h3>
          {reviews && reviews.length > 5 && (
            <button 
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition-colors"
            >
              {showAll ? 'Show Less' : 'Show All Reviews'}
              <FaFilter />
            </button>
          )}
        </div>

        {displayedReviews.length > 0 ? (
          <div className="space-y-6">
            {displayedReviews.map((review, index) => (
              <div key={review.id || index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-bold text-gray-800 text-lg">
                        {review.reviewer_name || review.customer_name || 'Anonymous'}
                      </div>
                      {review.is_verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <FaCheck size={10} /> Verified Purchase
                        </span>
                      )}
                      {review.status === 'pending' && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          Pending Approval
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex">
                        {[1,2,3,4,5].map((star) => (
                          <span 
                            key={star} 
                            className={star <= review.rating ? "text-yellow-400" : "text-gray-300"}
                          >
                            <FaStar size={18} />
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-600 font-bold">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <FaCalendarAlt size={12} />
                      {review.review_date || new Date(review.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                
                {review.review_title && (
                  <h4 className="font-bold text-gray-800 text-lg mb-3">{review.review_title}</h4>
                )}
                
                <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-line">
                  {review.review_text || review.comment}
                </p>
                
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Was this review helpful?</span>
                  <button className="flex items-center gap-1 text-green-600 hover:text-green-800 transition-colors">
                    <MdThumbUp /> Yes ({review.helpful || 0})
                  </button>
                  <button className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors">
                    <MdThumbDown /> No ({review.notHelpful || 0})
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <div className="mb-6">
              <FaStar className="text-gray-400 text-5xl mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-3">No Reviews Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Be the first to share your thoughts about this product. Your review will help other customers make informed decisions.
              </p>
            </div>
            <button 
              onClick={() => setShowReviewModal(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 mx-auto transition-colors"
            >
              <FaPlusCircle /> Write First Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Component
const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  // State variables
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [activeTab, setActiveTab] = useState('general');
  const [seoLevel, setSeoLevel] = useState('beginner');
  const [activeDescriptionTab, setActiveDescriptionTab] = useState(0);
  const [descriptionTabs, setDescriptionTabs] = useState([
    {
      id: Date.now(),
      title: "Description",
      content: "<h1>Product Description</h1><p>Start describing your product here...</p>",
      isReviewTab: false
    },
    {
      id: 'reviews-tab',
      title: "Reviews (0)",
      content: "",
      isReviewTab: true
    }
  ]);

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    slug: "",
    shortDescription: "",
    basePrice: "0",
    salePrice: "0",
    sku: "",
    stockStatus: "In Stock",
    stockQty: 100,
    manageStock: false,
    lowStockThreshold: 10,
    weight: "0.5",
    weightUnit: "kg",
    length: "10",
    width: "5",
    height: "15",
    dimensionUnit: "cm",
    shippingClass: "Free Shipping",
    shippingDays: "3-5",
    featureImage: null,
    bannerImage: null,
    sideImage: null,
    featureImgAlt: "",
    seoTitle: "",
    seoDescription: "",
    keywords: "",
    metaRobots: "index, follow",
    seoScore: 85,
    category: [],
    tags: "",
    ribbon: "",
    badgeColor: "#dc2626",
    brand: "",
    status: "draft",
    rating: 0,
    reviewCount: 0,
    enableReviews: true,
    variations: [],
    images: [],
    videos: [],
    gallery: [],
    faqs: [],
    reviews: []
  });

  // Refs
  const featureImgRef = useRef(null);
  const bannerImgRef = useRef(null);
  const sideImgRef = useRef(null);
 useEffect(() => {
    fetchCategoriesAndBrands();
  }, []);
  // Helper function to get image URL
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('uploads/')) return `${API_URL}/${url}`;
    if (url.startsWith('/')) return `${API_URL}${url}`;
    return `${API_URL}/${url}`;
  };

  // Fetch categories and brands
 

  // Load product data if editing
  useEffect(() => {
    if (isEditMode && id) {
      loadProductData(id);
    }
  }, [id, isEditMode]);

  const fetchCategoriesAndBrands = async () => {
    console.log('Fetching categories and brands...');
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        apiService.getCategories(),
        apiService.getBrands()
      ]);
      
      if (categoriesRes.success) {
        setCategories(categoriesRes.data || []);
      }
      
      if (brandsRes.success) {
        setBrands(brandsRes.data || []);
      }
    } catch (error) {
      console.error('Error loading categories/brands:', error);
    }
  };

  const loadProductData = async (productId) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const result = await apiService.getProduct(productId);
      
      if (result.success) {
        const product = result.data;
        
        // Map API data to form state
        const mappedData = {
          id: product.id || 0,
          name: product.name || "",
          slug: product.slug || "",
          shortDescription: product.short_description || "",
          basePrice: product.base_price || "0",
          salePrice: product.sale_price || "0",
          sku: product.sku || "",
          stockStatus: product.stock_status || "In Stock",
          stockQty: product.stock_qty || 100,
          manageStock: product.manage_stock === 1,
          lowStockThreshold: product.low_stock_threshold || 10,
          weight: product.weight?.toString() || "0.5",
          weightUnit: product.weight_unit || "kg",
          length: product.length?.toString() || "10",
          width: product.width?.toString() || "5",
          height: product.height?.toString() || "15",
          dimensionUnit: product.dimension_unit || "cm",
          shippingClass: product.shipping_class || "Free Shipping",
          shippingDays: product.shipping_days || "3-5",
          featureImage: product.feature_image || null,
          bannerImage: product.banner_image || null,
          sideImage: product.side_image || null,
          featureImgAlt: product.feature_img_alt || "",
          seoTitle: product.seo_title || "",
          seoDescription: product.seo_description || "",
          keywords: product.keywords || "",
          metaRobots: product.meta_robots || "index, follow",
          seoScore: product.seo_score || 85,
          category: product.category || [],
          tags: product.tags || "",
          ribbon: product.ribbon || "",
          badgeColor: product.badge_color || "#dc2626",
          brand: product.brand || "",
          status: product.status || "draft",
          rating: product.rating || 0,
          reviewCount: product.review_count || 0,
          enableReviews: product.enable_reviews !== 0,
          variations: product.variations || [],
          images: product.images || [],
          videos: product.videos || [],
          gallery: product.gallery || [],
          faqs: product.faqs || [],
          reviews: product.reviews || []
        };
        
        setFormData(mappedData);

        // Set description tabs
        const tabs = [];
        
        // Add description tabs from API
        if (product.description_tabs && product.description_tabs.length > 0) {
          tabs.push(...product.description_tabs.map(tab => ({
            id: tab.id || Date.now(),
            title: tab.tab_title || "Description",
            content: tab.tab_content || "",
            isReviewTab: false
          })));
        } else {
          // Default tab
          tabs.push({
            id: Date.now(),
            title: "Description",
            content: `<h1>${product.name || "Product Description"}</h1><p>Start describing your product here...</p>`,
            isReviewTab: false
          });
        }
        
        // Add Reviews tab
        tabs.push({
          id: 'reviews-tab',
          title: `Reviews (${mappedData.reviewCount})`,
          content: "",
          isReviewTab: true
        });
        
        setDescriptionTabs(tabs);
        
        setMessage({ type: 'success', text: 'Product loaded successfully' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to load product' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error loading product: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle single image upload
  const handleSingleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }
    
    setUploading(true);
    try {
      const result = await apiService.uploadFile(file, id, field);
      
      if (result.success) {
        setFormData(prev => ({ 
          ...prev, 
          [field]: result.data.file_url 
        }));
        
        setMessage({ type: 'success', text: 'Image uploaded successfully' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Upload failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload error: ' + error.message });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Handle gallery upload
  const handleGalleryUpload = async (files) => {
    setUploading(true);
    try {
      const result = await apiService.uploadMultipleFiles(files, id, 'gallery');
      
      if (result.success) {
        const newMedia = result.data.map(item => ({
          id: item.gallery_id || item.id,
          url: item.file_url,
          media_url: item.file_url,
          file_name: item.file_name,
          media_type: item.media_type,
          file_size: item.file_size,
          dimensions: item.dimensions,
          thumbnail_url: item.thumbnail
        }));
        
        setFormData(prev => ({
          ...prev,
          gallery: [...prev.gallery, ...newMedia]
        }));
        
        setMessage({ 
          type: 'success', 
          text: `Uploaded ${result.data.length} files successfully` 
        });
      } else {
        setMessage({ type: 'error', text: result.message || 'Upload failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload error: ' + error.message });
    } finally {
      setUploading(false);
    }
  };

  // Handle media deletion
  const handleMediaDelete = async (mediaId) => {
    if (!window.confirm('Are you sure you want to delete this media?')) {
      return;
    }
    
    try {
      const result = await apiService.deleteMedia(mediaId);
      
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          gallery: prev.gallery.filter(item => item.id !== mediaId),
          images: prev.images.filter(item => item.id !== mediaId),
          videos: prev.videos.filter(item => item.id !== mediaId)
        }));
        
        setMessage({ type: 'success', text: 'Media deleted successfully' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Delete failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Delete error: ' + error.message });
    }
  };

  // Add review
  const handleAddReview = async (reviewData) => {
    try {
      const result = await apiService.addReview(reviewData);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Review added successfully' });
        
        // Reload reviews
        if (id) {
          const reviewsResult = await apiService.getReviews(id);
          if (reviewsResult.success) {
            setFormData(prev => ({
              ...prev,
              reviews: reviewsResult.data,
              reviewCount: reviewsResult.total || reviewsResult.data.length
            }));
          }
        }
        
        return result;
      } else {
        throw new Error(result.message || 'Failed to add review');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSaveProduct = async () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Product name is required' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Prepare product data
      const productData = {
        id: isEditMode ? parseInt(id) : 0,
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        shortDescription: formData.shortDescription,
        basePrice: parseFloat(formData.basePrice) || 0,
        salePrice: parseFloat(formData.salePrice) || 0,
        sku: formData.sku,
        stockStatus: formData.stockStatus,
        stockQty: parseInt(formData.stockQty) || 0,
        manageStock: formData.manageStock,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 10,
        weight: parseFloat(formData.weight) || 0,
        weightUnit: formData.weightUnit,
        length: parseFloat(formData.length) || 0,
        width: parseFloat(formData.width) || 0,
        height: parseFloat(formData.height) || 0,
        dimensionUnit: formData.dimensionUnit,
        shippingClass: formData.shippingClass,
        shippingDays: formData.shippingDays,
        featureImage: formData.featureImage,
        bannerImage: formData.bannerImage,
        sideImage: formData.sideImage,
        featureImgAlt: formData.featureImgAlt,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        keywords: formData.keywords,
        metaRobots: formData.metaRobots,
        seoScore: parseInt(formData.seoScore) || 0,
        category: formData.category,
        tags: formData.tags,
        ribbon: formData.ribbon,
        badgeColor: formData.badgeColor,
        brand: formData.brand,
        status: formData.status,
        enableReviews: formData.enableReviews,
        variations: formData.variations,
        gallery: formData.gallery.map(item => ({
          id: item.id,
          url: item.media_url || item.url,
          media_type: item.media_type,
          media_alt: item.media_alt,
          thumbnail_url: item.thumbnail_url
        })),
        faqs: formData.faqs,
        descriptionTabs: descriptionTabs
          .filter(tab => !tab.isReviewTab)
          .map(tab => ({
            id: tab.id,
            title: tab.title,
            content: tab.content
          }))
      };

      console.log('Saving product data:', productData);
      
      const result = await apiService.saveProduct(productData);
      
      if (result.success) {
        const savedProductId = result.data.product_id || id;
        
        setMessage({ 
          type: 'success', 
          text: `Product ${isEditMode ? 'updated' : 'created'} successfully!` 
        });
        
        // If new product, navigate to edit page
        if (!isEditMode && savedProductId) {
          setTimeout(() => {
            navigate(`/edit-product/${savedProductId}`);
          }, 1500);
        }
        
        // Reload product data if editing
        if (isEditMode) {
          loadProductData(id);
        }
      } else {
        setMessage({ type: 'error', text: result.message || 'Save failed' });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Error saving product: ' + (error.response?.data?.message || error.message) 
      });
      console.error('Save error:', error.response || error);
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async () => {
    if (!isEditMode || !window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      const result = await apiService.deleteProduct(id);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Product deleted successfully' });
        setTimeout(() => {
          navigate('/products');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: result.message || 'Delete failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting product' });
    }
  };

  // Variations handlers
  const handleVariationChange = (id, field, value) => {
    const updatedVariations = formData.variations.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    );
    setFormData(prev => ({ ...prev, variations: updatedVariations }));
  };

  const addVariation = () => {
    const newVar = { 
      id: Date.now(), 
      size: "", 
      price: "", 
      stock: 0, 
      sku: "",
      unit: "ml"
    };
    setFormData(prev => ({ ...prev, variations: [...prev.variations, newVar] }));
  };

  const removeVariation = (id) => {
    setFormData(prev => ({ ...prev, variations: prev.variations.filter(v => v.id !== id) }));
  };

  // FAQ handlers
  const addFAQ = () => {
    const newFAQ = { 
      id: Date.now(), 
      question: "", 
      answer: "" 
    };
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, newFAQ]
    }));
  };

  const updateFAQ = (id, field, value) => {
    const updatedFaqs = formData.faqs.map(faq => 
      faq.id === id ? { ...faq, [field]: value } : faq
    );
    setFormData(prev => ({ ...prev, faqs: updatedFaqs }));
  };

  const removeFAQ = (id) => {
    const updatedFaqs = formData.faqs.filter(faq => faq.id !== id);
    setFormData(prev => ({ ...prev, faqs: updatedFaqs }));
  };

  // Description tabs handlers
  const addDescriptionTab = () => {
    const newTab = { 
      id: Date.now(), 
      title: "New Tab", 
      content: "<p>Start writing here...</p>",
      isReviewTab: false
    };
    setDescriptionTabs(prev => [...prev, newTab]);
    setActiveDescriptionTab(descriptionTabs.length);
  };

  const updateDescriptionTab = (id, field, value) => {
    const updatedTabs = descriptionTabs.map(tab => 
      tab.id === id ? { ...tab, [field]: value } : tab
    );
    setDescriptionTabs(updatedTabs);
  };

  const removeDescriptionTab = (id) => {
    if (descriptionTabs.length <= 1) return;
    
    const updatedTabs = descriptionTabs.filter(tab => tab.id !== id);
    setDescriptionTabs(updatedTabs);
    
    if (activeDescriptionTab >= updatedTabs.length) {
      setActiveDescriptionTab(updatedTabs.length - 1);
    }
  };

  // Calculate discount
  const discount = formData.basePrice && formData.salePrice && formData.basePrice > formData.salePrice ? 
    Math.round(((parseFloat(formData.basePrice) - parseFloat(formData.salePrice)) / parseFloat(formData.basePrice)) * 100) : 0;

  // Render description tab content
  const renderDescriptionTabContent = () => {
    const activeTab = descriptionTabs[activeDescriptionTab];
    
    if (activeTab.isReviewTab) {
      return (
        <ReviewsComponent
          reviews={formData.reviews}
          rating={formData.rating}
          reviewCount={formData.reviewCount}
          onAddReview={handleAddReview}
          productId={parseInt(id)}
          productName={formData.name}
        />
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            value={activeTab.title}
            onChange={(e) => updateDescriptionTab(activeTab.id, 'title', e.target.value)}
            className="text-xl font-bold border-none outline-none bg-transparent w-auto min-w-[200px]"
            placeholder="Tab Title"
          />
          <button 
            onClick={() => removeDescriptionTab(activeTab.id)}
            className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm border border-red-200 px-3 py-2 rounded hover:bg-red-50 transition-colors"
            disabled={descriptionTabs.length <= 1}
          >
            <FaTrash /> Remove Tab
          </button>
        </div>
        
        <RichTextEditor
          content={activeTab.content}
          onChange={(content) => updateDescriptionTab(activeTab.id, 'content', content)}
          productId={parseInt(id)}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-4 font-sans text-gray-700 pb-20">
      
      {/* Message Display */}
      {message.text && (
        <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg animate-fadeIn ${
          message.type === 'success'
            ? 'bg-green-100 text-green-800 border border-green-200'
            : message.type === 'error'
            ? 'bg-red-100 text-red-800 border border-red-200'
            : 'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'error' && <FaExclamationCircle className="text-red-600" />}
            {message.type === 'success' && <FaCheck className="text-green-600" />}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {(loading || saving || uploading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center gap-4">
            <FaSpinner className="animate-spin text-4xl text-blue-600" />
            <p className="text-gray-700 font-medium">
              {loading && 'Loading product...'}
              {saving && 'Saving product...'}
              {uploading && 'Uploading files...'}
            </p>
            <p className="text-sm text-gray-500">Please wait</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <Link 
                to="/products"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaArrowLeft />
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {isEditMode ? 'Edit Product' : 'Add New Product'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {isEditMode ? 'Edit product details' : 'Create a new product with complete details'}
                  {isEditMode && formData.sku && ` | SKU: ${formData.sku}`}
                  {isEditMode && formData.reviewCount > 0 && ` | ${formData.reviewCount} Reviews`}
                  {isEditMode && formData.gallery?.length > 0 && ` | ${formData.gallery.length} Media Files`}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <button 
                onClick={() => navigate('/products')}
                className="flex-1 md:flex-none bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded font-bold flex items-center justify-center gap-2 transition-all"
              >
                <FaTimesCircle /> Cancel
              </button>
              
              {isEditMode && (
                <>
                  <Link
                    to={`/product/${formData.slug}`}
                    target="_blank"
                    className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <FaEye /> View
                  </Link>
                  <button 
                    onClick={handleDeleteProduct}
                    className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <FaTrash /> Delete
                  </button>
                </>
              )}
              
              <button 
                onClick={handleSaveProduct}
                disabled={saving}
                className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} 
                {saving ? 'Saving...' : isEditMode ? 'Update Product' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Left Column - Main Content */}
        <div className="lg:col-span-3 space-y-4 md:space-y-6">
          
          {/* Product Title & Slug */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-5">
            <div className="flex items-center gap-2 mb-2">
              <MdOutlineTitle className="text-blue-500" />
              <span className="text-sm font-bold text-gray-600">Product Title</span>
            </div>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              placeholder="Enter product name" 
              className="w-full text-lg md:text-xl font-bold border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
            
            <div className="mt-4 flex flex-col md:flex-row md:items-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="font-bold mr-2">Permalink:</span>
              <div className="flex items-center w-full">
                <span className="text-blue-600 text-sm">https://example.com/product/</span>
                <input 
                  type="text" 
                  name="slug" 
                  value={formData.slug} 
                  onChange={handleChange}
                  className="bg-transparent border-b border-gray-400 text-gray-800 focus:border-blue-500 outline-none px-1 mx-1 flex-1 font-mono text-sm"
                  placeholder={formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                />
              </div>
            </div>
          </div>

          {/* Description Editor */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <div className="flex items-center justify-between px-4 md:px-6 pt-4">
                <h3 className="font-bold text-gray-700">Product Details</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={addDescriptionTab}
                    className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 flex items-center gap-1 border border-blue-500 transition-colors"
                  >
                    <FaPlusCircle size={14} /> Add Tab
                  </button>
                </div>
              </div>
              
              <div className="flex border-b border-gray-200 px-4 md:px-6 mt-3 overflow-x-auto">
                {descriptionTabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDescriptionTab(index)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${index === activeDescriptionTab ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                  >
                    {tab.title}
                    {!tab.isReviewTab && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDescriptionTab(tab.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        disabled={descriptionTabs.length <= 1}
                      >
                        <FaTimesCircle size={12} />
                      </button>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 md:p-6">
              {renderDescriptionTabContent()}
            </div>
          </div>

          {/* Product Data Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-48 bg-gray-50 border-b md:border-r border-gray-200 pt-4 px-2 space-y-1 flex md:flex-col overflow-x-auto">
                {[
                  {id: 'general', icon: <AiOutlineShopping/>, label: 'General'},
                  {id: 'inventory', icon: <FaBoxOpen/>, label: 'Inventory'},
                  {id: 'shipping', icon: <FaTruck/>, label: 'Shipping'},
                  {id: 'variations', icon: <FaRulerCombined/>, label: 'Variations'},
                  {id: 'media', icon: <MdPhotoLibrary/>, label: 'Media'},
                  {id: 'faq', icon: <MdDescription/>, label: 'FAQ'},
                  {id: 'seo', icon: <FaGoogle/>, label: 'SEO'}
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-left px-3 py-2.5 text-sm font-bold flex items-center gap-2 rounded transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 p-4 md:p-6 min-h-[400px] overflow-y-auto">
                 
                {/* General Tab */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Regular Price (₹)
                        </label>
                        <input 
                          type="number" 
                          name="basePrice" 
                          value={formData.basePrice} 
                          onChange={handleChange} 
                          className="w-full border rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Sale Price (₹)
                        </label>
                        <input 
                          type="number" 
                          name="salePrice" 
                          value={formData.salePrice} 
                          onChange={handleChange} 
                          className="w-full border rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    {discount > 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                          <div>
                            <span className="text-sm font-bold text-blue-800">Discount Applied:</span>
                            <span className="text-sm text-gray-700 ml-2">₹{formData.basePrice} → ₹{formData.salePrice}</span>
                          </div>
                          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-bold inline-block w-fit shadow-sm">
                            {discount}% OFF
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Short Description
                      </label>
                      <textarea 
                        name="shortDescription" 
                        rows="4" 
                        className="w-full border rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="Brief summary that appears on product cards..."
                        value={formData.shortDescription}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* Inventory Tab */}
                {activeTab === 'inventory' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">SKU</label>
                        <input 
                          name="sku" 
                          value={formData.sku} 
                          onChange={handleChange} 
                          className="w-full border rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" 
                          placeholder="PROD-001"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            id="manageStock" 
                            checked={formData.manageStock} 
                            onChange={(e) => setFormData(prev => ({...prev, manageStock: e.target.checked}))}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm font-bold text-gray-700">Manage Stock</span>
                        </label>
                      </div>
                    </div>
                    
                    {formData.manageStock && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Stock Quantity</label>
                            <input 
                              type="number" 
                              name="stockQty" 
                              value={formData.stockQty} 
                              onChange={handleChange} 
                              className="w-full border rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                              min="0"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Low Stock Threshold</label>
                            <input 
                              type="number" 
                              name="lowStockThreshold" 
                              value={formData.lowStockThreshold} 
                              onChange={handleChange} 
                              className="w-full border rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                              min="0"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Stock Status</label>
                            <select 
                              name="stockStatus" 
                              value={formData.stockStatus} 
                              onChange={handleChange} 
                              className="w-full border rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white"
                            >
                              <option value="In Stock">In Stock</option>
                              <option value="Out of Stock">Out of Stock</option>
                              <option value="On Backorder">On Backorder</option>
                              <option value="Pre Order">Pre Order</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Shipping Tab */}
                {activeTab === 'shipping' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Weight</label>
                        <div className="flex gap-2">
                          <input 
                            name="weight" 
                            value={formData.weight} 
                            onChange={handleChange} 
                            className="flex-1 border rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" 
                            placeholder="0.5"
                          />
                          <select 
                            name="weightUnit" 
                            value={formData.weightUnit} 
                            onChange={handleChange} 
                            className="w-24 border rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white"
                          >
                            <option value="kg">kg</option>
                            <option value="g">g</option>
                            <option value="lb">lb</option>
                            <option value="oz">oz</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Shipping Class</label>
                        <select 
                          name="shippingClass" 
                          value={formData.shippingClass} 
                          onChange={handleChange} 
                          className="w-full border rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white"
                        >
                          <option value="Free Shipping">Free Shipping</option>
                          <option value="Standard Shipping">Standard Shipping</option>
                          <option value="Express Shipping">Express Shipping</option>
                          <option value="Overnight Shipping">Overnight Shipping</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Dimensions (L × W × H)</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <input 
                            placeholder="Length" 
                            name="length" 
                            value={formData.length} 
                            onChange={handleChange} 
                            className="w-full border rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                          />
                        </div>
                        <div>
                          <input 
                            placeholder="Width" 
                            name="width" 
                            value={formData.width} 
                            onChange={handleChange} 
                            className="w-full border rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                          />
                        </div>
                        <div>
                          <input 
                            placeholder="Height" 
                            name="height" 
                            value={formData.height} 
                            onChange={handleChange} 
                            className="w-full border rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                          />
                        </div>
                        <select 
                          name="dimensionUnit" 
                          value={formData.dimensionUnit} 
                          onChange={handleChange} 
                          className="border rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white"
                        >
                          <option value="cm">cm</option>
                          <option value="m">m</option>
                          <option value="inch">inch</option>
                          <option value="ft">ft</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Shipping Days</label>
                      <input 
                        name="shippingDays" 
                        value={formData.shippingDays} 
                        onChange={handleChange} 
                        className="w-full border rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none" 
                        placeholder="3-5 business days"
                      />
                    </div>
                  </div>
                )}

                {/* Variations Tab */}
                {activeTab === 'variations' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">Product Variations</h3>
                        <p className="text-sm text-gray-600">Add different sizes, colors, and prices</p>
                      </div>
                      <button 
                        onClick={addVariation} 
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-bold flex items-center gap-2 transition-colors"
                      >
                        <FaPlusCircle/> Add Variation
                      </button>
                    </div>
                    
                    {formData.variations.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                        <FaRulerCombined className="text-5xl text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-gray-700 mb-2">No Variations Added</h4>
                        <p className="text-gray-600 mb-4">
                          Add variations like sizes, colors, or different versions of your product
                        </p>
                        <button 
                          onClick={addVariation} 
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                        >
                          Add First Variation
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse min-w-[700px]">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border p-3 text-left text-sm font-bold text-gray-700">Size/Volume</th>
                              <th className="border p-3 text-left text-sm font-bold text-gray-700">Unit</th>
                              <th className="border p-3 text-left text-sm font-bold text-gray-700">Price (₹)</th>
                              <th className="border p-3 text-left text-sm font-bold text-gray-700">Stock</th>
                              <th className="border p-3 text-left text-sm font-bold text-gray-700">SKU</th>
                              <th className="border p-3 text-left text-sm font-bold text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {formData.variations.map((v) => (
                              <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                                <td className="border p-3">
                                  <input 
                                    value={v.size} 
                                    onChange={(e)=>handleVariationChange(v.id, 'size', e.target.value)} 
                                    placeholder="e.g. 100ml, Red, Large" 
                                    className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none"
                                  />
                                </td>
                                <td className="border p-3">
                                  <select 
                                    value={v.unit} 
                                    onChange={(e)=>handleVariationChange(v.id, 'unit', e.target.value)} 
                                    className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none bg-white"
                                  >
                                    <option value="ml">ml</option>
                                    <option value="kg">kg</option>
                                    <option value="g">g</option>
                                    <option value="l">l</option>
                                    <option value="piece">piece</option>
                                  </select>
                                </td>
                                <td className="border p-3">
                                  <input 
                                    value={v.price} 
                                    onChange={(e)=>handleVariationChange(v.id, 'price', e.target.value)} 
                                    placeholder="499" 
                                    className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none"
                                    type="number"
                                    step="0.01"
                                  />
                                </td>
                                <td className="border p-3">
                                  <input 
                                    type="number" 
                                    value={v.stock} 
                                    onChange={(e)=>handleVariationChange(v.id, 'stock', e.target.value)} 
                                    className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none"
                                    min="0"
                                  />
                                </td>
                                <td className="border p-3">
                                  <input 
                                    value={v.sku} 
                                    onChange={(e)=>handleVariationChange(v.id, 'sku', e.target.value)} 
                                    className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none"
                                    placeholder="VAR-001"
                                  />
                                </td>
                                <td className="border p-3">
                                  <button 
                                    onClick={() => removeVariation(v.id)} 
                                    className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                                  >
                                    <FaTrash size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                  <div className="space-y-6">
                    <MediaGallery
                      media={formData.gallery}
                      onUpload={handleGalleryUpload}
                      onDelete={handleMediaDelete}
                      uploading={uploading}
                      productId={parseInt(id)}
                    />
                  </div>
                )}

                {/* FAQ Tab */}
                {activeTab === 'faq' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">Frequently Asked Questions</h3>
                        <p className="text-sm text-gray-600">Add common questions and answers about your product</p>
                      </div>
                      <button 
                        onClick={addFAQ}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-bold flex items-center gap-2 transition-colors"
                      >
                        <FaPlusCircle /> Add FAQ
                      </button>
                    </div>
                    
                    {formData.faqs.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                        <FaQuestionCircle className="text-5xl text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-gray-700 mb-2">No FAQs Added</h4>
                        <p className="text-gray-600 mb-4">
                          Add common questions that customers might have about your product
                        </p>
                        <button 
                          onClick={addFAQ}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                        >
                          Add First FAQ
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {formData.faqs.map(faq => (
                          <div key={faq.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                            <div className="bg-gray-50 p-4 border-b">
                              <input 
                                type="text" 
                                value={faq.question} 
                                onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                                placeholder="Enter question..."
                                className="w-full font-bold text-gray-700 bg-transparent border-none outline-none text-lg"
                              />
                            </div>
                            <div className="p-4">
                              <textarea 
                                value={faq.answer} 
                                onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                                placeholder="Enter answer..."
                                rows="3"
                                className="w-full text-gray-600 border rounded-lg p-3 outline-none resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              />
                            </div>
                            <div className="bg-gray-50 p-3 border-t flex justify-end">
                              <button 
                                onClick={() => removeFAQ(faq.id)}
                                className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm transition-colors"
                              >
                                <FaTrash /> Remove FAQ
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                  <div className="space-y-8">
                    <div>
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
                        <h3 className="text-lg font-bold text-gray-800">SEO Settings</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">SEO Level:</span>
                          <select 
                            value={seoLevel} 
                            onChange={(e) => setSeoLevel(e.target.value)}
                            className="border rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                            <option value="expert">Expert</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-bold text-gray-800">SEO Score</h4>
                            <p className="text-sm text-gray-600">Based on your SEO optimization</p>
                          </div>
                          <div className="text-4xl font-bold text-blue-600">{formData.seoScore}</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-1000" 
                            style={{ width: `${Math.min(formData.seoScore, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>0</span>
                          <span>50</span>
                          <span>100</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">SEO Title</label>
                        <div className="flex items-center gap-2 mb-1">
                          <input 
                            name="seoTitle" 
                            value={formData.seoTitle} 
                            onChange={handleChange} 
                            maxLength="60"
                            className="w-full border rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            placeholder="Optimized product title for search engines"
                          />
                          <span className="text-sm text-gray-500 whitespace-nowrap">
                            {formData.seoTitle.length}/60
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Recommended: 50-60 characters</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Meta Description</label>
                        <div className="flex items-center gap-2 mb-1">
                          <textarea 
                            name="seoDescription" 
                            value={formData.seoDescription} 
                            onChange={handleChange} 
                            maxLength="160"
                            rows="3"
                            className="w-full border rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-y"
                            placeholder="Brief description that appears in search results"
                          />
                          <span className="text-sm text-gray-500 whitespace-nowrap">
                            {formData.seoDescription.length}/160
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Recommended: 150-160 characters</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Focus Keywords</label>
                        <input 
                          name="keywords" 
                          value={formData.keywords} 
                          onChange={handleChange} 
                          placeholder="comma, separated, keywords" 
                          className="w-full border rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Meta Robots</label>
                        <select 
                          name="metaRobots" 
                          value={formData.metaRobots} 
                          onChange={handleChange} 
                          className="w-full border rounded-lg p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white"
                        >
                          <option value="index, follow">Index, Follow</option>
                          <option value="noindex, follow">Noindex, Follow</option>
                          <option value="index, nofollow">Index, Nofollow</option>
                          <option value="noindex, nofollow">Noindex, Nofollow</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1 space-y-4 md:space-y-6">
          
          {/* Publish Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-5">
            <h3 className="font-bold text-gray-700 mb-3 border-b pb-2">Publish</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData(prev => ({...prev, status: e.target.value}))}
                  className="border rounded p-2 text-sm focus:border-blue-500 outline-none bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Review</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Visibility:</span>
                <span className="font-bold text-green-600">Public</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Reviews:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="enableReviews" 
                    checked={formData.enableReviews} 
                    onChange={(e) => setFormData(prev => ({...prev, enableReviews: e.target.checked}))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">Enable</span>
                </label>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <button 
                onClick={handleSaveProduct}
                disabled={saving}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md"
              >
                {saving ? <FaSpinner className="animate-spin" /> : <FaCheck />} 
                {saving ? 'Saving...' : (isEditMode ? 'Update Product' : 'Publish Product')}
              </button>
              <button 
                onClick={() => navigate('/products')}
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-5">
            <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase flex items-center gap-2">
              <FaImage /> Featured Image
            </h3>
            <div 
              onClick={() => featureImgRef.current.click()}
              className="aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 overflow-hidden relative transition-all group"
            >
              {formData.featureImage ? (
                <>
                  <img 
                    src={getImageUrl(formData.featureImage)} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    alt="Featured"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x400?text=Featured+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-white font-bold">Change Image</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <FaCloudUploadAlt className="mx-auto text-gray-400 text-4xl mb-3 group-hover:text-blue-400 transition-colors"/>
                  <span className="text-sm text-blue-600 font-bold">Upload Image</span>
                  <p className="text-xs text-gray-500 mt-1">Recommended: 800x800px</p>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={featureImgRef} 
              hidden 
              onChange={(e) => handleSingleImageUpload(e, 'featureImage')}
              accept="image/*"
            />
            <div className="mt-3">
              <input 
                type="text" 
                name="featureImgAlt" 
                value={formData.featureImgAlt} 
                onChange={handleChange}
                placeholder="Image alt text for SEO"
                className="w-full border rounded-lg p-2 text-sm focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Banner Image */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-5">
            <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase flex items-center gap-2">
              <MdInsertPhoto /> Banner Image
            </h3>
            <div 
              onClick={() => bannerImgRef.current.click()}
              className="aspect-video bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 overflow-hidden relative transition-all group"
            >
              {formData.bannerImage ? (
                <>
                  <img 
                    src={getImageUrl(formData.bannerImage)} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    alt="Banner"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x200?text=Banner+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-white font-bold">Change Image</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <FaCloudUploadAlt className="mx-auto text-gray-400 text-4xl mb-3 group-hover:text-blue-400 transition-colors"/>
                  <span className="text-sm text-blue-600 font-bold">Upload Banner</span>
                  <p className="text-xs text-gray-500 mt-1">Recommended: 800x200px</p>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={bannerImgRef} 
              hidden 
              onChange={(e) => handleSingleImageUpload(e, 'bannerImage')}
              accept="image/*"
            />
          </div>

          {/* Side Image/Video */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-5">
            <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase flex items-center gap-2">
              <MdMovie /> Side Image/Video
            </h3>
            <div 
              onClick={() => sideImgRef.current.click()}
              className="aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 overflow-hidden relative transition-all group"
            >
              {formData.sideImage ? (
                formData.sideImage.match(/\.(mp4|webm|ogg|mov|avi)$/i) ? (
                  <>
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                      <FaFileVideo className="text-4xl text-white opacity-50" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FaPlayCircle className="text-3xl text-white opacity-80" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-white font-bold">Change Media</span>
                    </div>
                  </>
                ) : (
                  <>
                    <img 
                      src={getImageUrl(formData.sideImage)} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      alt="Side"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x400?text=Side+Image';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-white font-bold">Change Image</span>
                    </div>
                  </>
                )
              ) : (
                <div className="text-center p-4">
                  <FaCloudUploadAlt className="mx-auto text-gray-400 text-4xl mb-3 group-hover:text-blue-400 transition-colors"/>
                  <span className="text-sm text-blue-600 font-bold">Upload Image/Video</span>
                  <p className="text-xs text-gray-500 mt-1">Optional side media</p>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={sideImgRef} 
              hidden 
              onChange={(e) => handleSingleImageUpload(e, 'sideImage')}
              accept="image/*,video/*"
            />
          </div>

          {/* Organization */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-5">
            <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase">Organization</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Product Category</label>
              <div className="max-h-48 overflow-y-auto border rounded-lg p-3 bg-gray-50 space-y-2">
                {categories.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-2">No categories found</p>
                ) : (
                  categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors">
                      <input 
                        type="checkbox" 
                        checked={formData.category.includes(cat.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              category: [...prev.category, cat.name]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              category: prev.category.filter(c => c !== cat.name)
                            }));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{cat.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Product Tags</label>
              <input 
                name="tags" 
                value={formData.tags} 
                onChange={handleChange} 
                placeholder="Separate with commas" 
                className="w-full border rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">e.g. organic, natural, premium</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Brand</label>
              <select 
                value={formData.brand} 
                onChange={(e) => setFormData(prev => ({...prev, brand: e.target.value}))}
                className="w-full border rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white"
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.name}>{brand.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ribbon / Badge</label>
              <div className="flex gap-3">
                <select 
                  value={formData.ribbon} 
                  onChange={(e) => setFormData(prev => ({...prev, ribbon: e.target.value}))}
                  className="flex-1 border rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white"
                >
                  <option value="">No Badge</option>
                  <option value="New Arrival">New Arrival</option>
                  <option value="Best Seller">Best Seller</option>
                  <option value="Limited Edition">Limited Edition</option>
                  <option value="Hot Deal">Hot Deal</option>
                  <option value="Trending">Trending</option>
                  <option value="Premium">Premium</option>
                  <option value="Sale">Sale</option>
                  <option value="Featured">Featured</option>
                </select>
                {formData.ribbon && (
                  <div className="relative">
                    <input 
                      type="color" 
                      value={formData.badgeColor}
                      onChange={(e) => setFormData(prev => ({...prev, badgeColor: e.target.value}))}
                      className="w-12 h-12 border rounded-lg cursor-pointer"
                    />
                    <div 
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white"
                      style={{ backgroundColor: formData.badgeColor }}
                    ></div>
                  </div>
                )}
              </div>
              {formData.ribbon && (
                <div className="mt-2 flex items-center justify-center">
                  <span 
                    className="px-3 py-1 text-xs font-bold text-white rounded"
                    style={{ backgroundColor: formData.badgeColor }}
                  >
                    {formData.ribbon}
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddProduct;